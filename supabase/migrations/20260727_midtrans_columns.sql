alter table public.bookings
  add column if not exists payment_provider text,
  add column if not exists midtrans_order_id text,
  add column if not exists paid_at timestamptz;

create unique index if not exists bookings_midtrans_order_id_uq
  on public.bookings(midtrans_order_id)
  where midtrans_order_id is not null;
