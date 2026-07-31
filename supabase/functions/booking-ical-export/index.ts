export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "text/calendar; charset=utf-8",
};

type VillaId = 1 | 2;

type BookingRow = {
  check_in: string;
  check_out: string;
  booking_reference: string;
  guest_name: string;
};

function getEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function toIcsDate(ymd: string) {
  return ymd.replaceAll("-", "");
}

function escapeIcs(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
}

function buildIcs(villaId: VillaId, bookings: BookingRow[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Villagading//Booking Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const booking of bookings) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${escapeIcs(booking.booking_reference)}@villagading`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,
      `DTSTART;VALUE=DATE:${toIcsDate(booking.check_in)}`,
      `DTEND;VALUE=DATE:${toIcsDate(booking.check_out)}`,
      `SUMMARY:${escapeIcs(`Villa ${villaId} booked`)}`,
      `DESCRIPTION:${escapeIcs(`Booking reference: ${booking.booking_reference} | Guest: ${booking.guest_name}`)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

async function fetchBookings(supabaseUrl: string, serviceRoleKey: string, villaId: VillaId) {
  const endpoint =
    `${supabaseUrl}/rest/v1/bookings` +
    "?select=check_in,check_out,booking_reference,guest_name" +
    `&villa_id=eq.${villaId}` +
    "&booking_status=neq.cancelled" +
    "&order=check_in.asc";

  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch bookings (${res.status})`);
  }

  return (await res.json()) as BookingRow[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const supabaseUrl = getEnv("SUPABASE_URL");
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    const url = new URL(req.url);
    const villaParam = url.searchParams.get("villa");
    const villaId = Number(villaParam) as VillaId;

    if (villaId !== 1 && villaId !== 2) {
      return new Response(JSON.stringify({ error: "Invalid villa. Use villa=1 or villa=2." }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const bookings = await fetchBookings(supabaseUrl, serviceRoleKey, villaId);
    const ics = buildIcs(villaId, bookings);

    return new Response(ics, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error instanceof Error ? error.message : error) }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
});
