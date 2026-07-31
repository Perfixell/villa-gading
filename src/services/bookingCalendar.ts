// src/services/bookingCalendar.ts
const FUNCTIONS_BASE = "https://qbjyjkeflhkepprtlfiq.functions.supabase.co";

export async function getBlockedDates(villaId: 1 | 2): Promise<string[]> {
  const res = await fetch(`${FUNCTIONS_BASE}/booking-calendar?villa=${villaId}`);

  if (!res.ok) {
    throw new Error(`Failed to load blocked dates (${res.status})`);
  }

  const data: { blockedDates?: string[] } = await res.json();
  return data.blockedDates ?? [];
}