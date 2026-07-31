export async function isVillaAvailable(
  villaId: number,
  checkIn: string,
  checkOut: string
) {
  const { supabase } = await import("../lib/supabase");
  const { data, error } = await supabase.rpc("check_villa_availability", {
    p_villa_id: villaId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) throw error;

  return Boolean(data);
}

export async function createBooking(data: {
  booking_reference: string;
  villa_id: number;
  guest_name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  check_in: string;
  check_out: string;
  total_price: number;
  special_requests?: string;
}) {
  const res = await fetch(
    "https://qbjyjkeflhkepprtlfiq.functions.supabase.co/booking-create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const payload = (await res.json()) as { error?: string };

  if (!res.ok) {
    throw new Error(
      payload.error || "Failed to create booking. Please try again."
    );
  }
}