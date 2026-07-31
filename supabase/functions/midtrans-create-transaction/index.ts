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

type BookingRow = {
  id: string;
  booking_reference: string;
  villa_id: number;
  guest_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  total_price: number;
  payment_status: string;
  booking_status: string;
  midtrans_order_id: string | null;
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

function toBasicAuth(serverKey: string) {
  return `Basic ${btoa(`${serverKey}:`)}`;
}

function buildOrderId(existingOrderId: string | null, bookingReference: string) {
  if (existingOrderId) return existingOrderId;
  return `${bookingReference}-${Date.now()}`;
}

async function fetchBookingByReference(
  supabaseUrl: string,
  serviceRoleKey: string,
  bookingReference: string,
): Promise<BookingRow | null> {
  const endpoint =
    `${supabaseUrl}/rest/v1/bookings` +
    "?select=id,booking_reference,villa_id,guest_name,email,phone,check_in,check_out,total_price,payment_status,booking_status,midtrans_order_id" +
    `&booking_reference=eq.${encodeURIComponent(bookingReference)}` +
    "&limit=1";

  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch booking (${res.status})`);
  }

  const rows = (await res.json()) as BookingRow[];
  return rows[0] ?? null;
}

async function updateBookingPaymentData(
  supabaseUrl: string,
  serviceRoleKey: string,
  bookingReference: string,
  orderId: string,
) {
  const endpoint =
    `${supabaseUrl}/rest/v1/bookings` +
    `?booking_reference=eq.${encodeURIComponent(bookingReference)}`;

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      midtrans_order_id: orderId,
      payment_provider: "midtrans",
      booking_status: "pending_payment",
      payment_status: "pending",
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update booking payment data (${res.status})`);
  }
}

type MidtransResponse = {
  token: string;
  redirect_url: string;
};

async function createSnapTransaction(
  serverKey: string,
  isProduction: boolean,
  booking: BookingRow,
  orderId: string,
): Promise<MidtransResponse> {
  const baseUrl = isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";

  const body = {
    transaction_details: {
      order_id: orderId,
      gross_amount: Math.max(1, Math.round(booking.total_price)),
    },
    customer_details: {
      first_name: booking.guest_name,
      email: booking.email,
      phone: booking.phone,
    },
    item_details: [
      {
        id: `villa-${booking.villa_id}`,
        name: `Villa Booking ${booking.check_in} to ${booking.check_out}`,
        quantity: 1,
        price: Math.max(1, Math.round(booking.total_price)),
      },
    ],
  };

  const res = await fetch(`${baseUrl}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Authorization: toBasicAuth(serverKey),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Midtrans transaction failed (${res.status}): ${text}`);
  }

  return (await res.json()) as MidtransResponse;
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
    const midtransServerKey = getEnv("MIDTRANS_SERVER_KEY");
    const isProduction = (Deno.env.get("MIDTRANS_IS_PRODUCTION") ?? "false") === "true";

    const body = (await req.json()) as { bookingReference?: string };
    const bookingReference = body.bookingReference?.trim();

    if (!bookingReference) {
      return json({ error: "bookingReference is required" }, 400);
    }

    const booking = await fetchBookingByReference(
      supabaseUrl,
      serviceRoleKey,
      bookingReference,
    );

    if (!booking) {
      return json({ error: "Booking not found" }, 404);
    }

    if (booking.payment_status === "paid") {
      return json({
        status: "paid",
        message: "Booking already paid",
      });
    }

    const orderId = buildOrderId(booking.midtrans_order_id, booking.booking_reference);
    const midtrans = await createSnapTransaction(
      midtransServerKey,
      isProduction,
      booking,
      orderId,
    );

    await updateBookingPaymentData(
      supabaseUrl,
      serviceRoleKey,
      booking.booking_reference,
      orderId,
    );

    return json({
      status: "pending",
      token: midtrans.token,
      redirectUrl: midtrans.redirect_url,
      orderId,
    });
  } catch (error) {
    return json(
      {
        error: String(error instanceof Error ? error.message : error),
      },
      500,
    );
  }
});
