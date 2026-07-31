// src/services/pricing.ts
import { supabase } from "../lib/supabase";

type PricingRow = {
  villa_id: number;
  label: string;
  start_date: string;
  end_date: string;
  nightly_price: number;
  active: boolean;
};

export async function getPricingPeriods(villaId: number) {
  const { data, error } = await supabase
    .from("pricing_periods")
    .select("*")
    .eq("villa_id", villaId)
    .eq("active", true)
    .order("start_date", { ascending: true });

  if (error) throw error;

  return (data ?? []) as PricingRow[];
}

export async function calculateBookingPrice(
  villaId: number,
  checkIn: string,
  checkOut: string
) {
  const periods = await getPricingPeriods(villaId);

  if (!periods.length) {
    throw new Error("No pricing configured.");
  }

  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);

  const nightlyBreakdown: {
    date: string;
    price: number;
    label: string;
  }[] = [];

  let total = 0;

  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const ymd = d.toISOString().slice(0, 10);
    const period = periods.find((p) => ymd >= p.start_date && ymd <= p.end_date);

    if (!period) {
      throw new Error(`No pricing found for ${ymd}`);
    }

    nightlyBreakdown.push({
      date: ymd,
      price: period.nightly_price,
      label: period.label,
    });

    total += period.nightly_price;
  }

  return {
    total,
    nightlyBreakdown,
  };
}