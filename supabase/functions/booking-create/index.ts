export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

type VillaId = 1 | 2;

type CreateBookingPayload = {
  booking_reference: string;
  villa_id: VillaId;
  guest_name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  check_in: string;
  check_out: string;
  total_price: number;
  special_requests?: string;
};

type BookingRow = {
  check_in: string;
  check_out: string;
  booking_status: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function formatLocalYMD(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseYmdUtc(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

function addUtcDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function isDateRangeBlocked(start: string, end: string, blockedDates: string[]) {
  if (!start || !end) return false;

  const from = parseYmdUtc(start);
  const to = parseYmdUtc(end);
  if (!from || !to || from >= to) return true;

  for (let d = new Date(from); d < to; d = addUtcDays(d, 1)) {
    if (blockedDates.includes(formatLocalYMD(d))) return true;
  }

  return false;
}

async function fetchBlockedDates(supabaseUrl: string, serviceRoleKey: string, villaId: VillaId) {
  const endpoint = `${supabaseUrl}/functions/v1/booking-calendar?villa=${villaId}`;

  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load blocked dates (${res.status})`);
  }

  const data = (await res.json()) as { blockedDates?: string[] };
  return data.blockedDates ?? [];
}

async function fetchConflictingBookings(
  supabaseUrl: string,
  serviceRoleKey: string,
  villaId: VillaId,
  checkIn: string,
  checkOut: string,
): Promise<BookingRow[]> {
  const endpoint =
    `${supabaseUrl}/rest/v1/bookings` +
    "?select=check_in,check_out,booking_status" +
    `&villa_id=eq.${villaId}` +
    "&booking_status=neq.cancelled" +
    `&check_in=lt.${encodeURIComponent(checkOut)}` +
    `&check_out=gt.${encodeURIComponent(checkIn)}`;

  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to check booking conflicts (${res.status})`);
  }

  return (await res.json()) as BookingRow[];
}

async function insertBooking(
  supabaseUrl: string,
  serviceRoleKey: string,
  payload: CreateBookingPayload,
) {
  const res = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      ...payload,
      payment_status: "pending",
      booking_status: "pending_payment",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create booking (${res.status}): ${text}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = getEnv("SUPABASE_URL");
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    const payload = (await req.json()) as CreateBookingPayload;

    if (
      !payload.booking_reference ||
      !payload.villa_id ||
      !payload.guest_name ||
      !payload.email ||
      !payload.phone ||
      !payload.check_in ||
      !payload.check_out ||
      !payload.total_price
    ) {
      return json({ error: "Missing required booking fields" }, 400);
    }

    const blockedDates = await fetchBlockedDates(supabaseUrl, serviceRoleKey, payload.villa_id);

    if (isDateRangeBlocked(payload.check_in, payload.check_out, blockedDates)) {
      return json(
        { error: "Those dates are unavailable. Please choose different dates." },
        409,
      );
    }

    const conflicts = await fetchConflictingBookings(
      supabaseUrl,
      serviceRoleKey,
      payload.villa_id,
      payload.check_in,
      payload.check_out,
    );

    if (conflicts.length > 0) {
      return json(
        { error: "Those dates were just booked by another guest. Please choose different dates." },
        409,
      );
    }

    await insertBooking(supabaseUrl, serviceRoleKey, payload);

    return json({ ok: true, booking_reference: payload.booking_reference }, 201);
  } catch (error) {
    return json(
      { error: String(error instanceof Error ? error.message : error) },
      500,
    );
  }
});
