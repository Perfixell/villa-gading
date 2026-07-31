// src/services/availability.ts
import { supabase } from "../lib/supabase";

type BookingRow = {
  check_in: string;
  check_out: string;
  booking_status: string;
};

export async function isVillaAvailable(
  villaId: number,
  checkIn: string,
  checkOut: string
) {
  const { data, error } = await supabase
    .from("bookings")
    .select("check_in, check_out, booking_status")
    .eq("villa_id", villaId)
    .neq("booking_status", "cancelled");

  if (error) throw error;

  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);

  const hasOverlap = (data as BookingRow[] | null | undefined)?.some(
    (booking) => {
      const existingStart = new Date(`${booking.check_in}T00:00:00Z`);
      const existingEnd = new Date(`${booking.check_out}T00:00:00Z`);
      return start < existingEnd && end > existingStart;
    }
  );

  return !hasOverlap;
}