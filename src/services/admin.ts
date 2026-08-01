import { supabase } from "../lib/supabase";

export type AdminBooking = {
  id: string;
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
  payment_status: string;
  booking_status: string;
  created_at: string;
};

export type AdminPricingPeriod = {
  id: number;
  villa_id: number;
  label: string;
  start_date: string;
  end_date: string;
  nightly_price: number;
  minimum_stay: number;
  active: boolean;
};

export async function isCurrentUserAdmin() {
  const { data, error } = await supabase.from("admin_users").select("user_id").maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function getAdminBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("id,booking_reference,villa_id,guest_name,email,phone,adults,children,check_in,check_out,total_price,payment_status,booking_status,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminBooking[];
}

export async function updateBookingStatus(id: string, bookingStatus: string) {
  const { error } = await supabase.from("bookings").update({ booking_status: bookingStatus }).eq("id", id);
  if (error) throw error;
}

export async function getAdminPricing() {
  const { data, error } = await supabase.from("pricing_periods").select("*").order("start_date");
  if (error) throw error;
  return (data ?? []) as AdminPricingPeriod[];
}

export async function savePricingPeriod(period: Omit<AdminPricingPeriod, "id"> & { id?: number }) {
  const { id, ...values } = period;
  const query = id
    ? supabase.from("pricing_periods").update(values).eq("id", id)
    : supabase.from("pricing_periods").insert(values);
  const { error } = await query;
  if (error) throw error;
}
