export interface PricingPeriod {
  start_date: string;
  end_date: string;
  nightly_price: number;
}

export function calculatePrice(
  checkIn: string,
  checkOut: string,
  periods: PricingPeriod[]
) {
  if (!checkIn || !checkOut) {
    return {
      nights: 0,
      total: 0,
    };
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  let total = 0;
  let nights = 0;

  const current = new Date(start);

  while (current < end) {
    nights++;

    const dateString = current.toISOString().split("T")[0];

    const period = periods.find(
      (p) =>
        dateString >= p.start_date &&
        dateString <= p.end_date
    );

    if (period) {
      total += period.nightly_price;
    }

    current.setDate(current.getDate() + 1);
  }

  return {
    nights,
    total,
  };
}