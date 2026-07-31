-- Prevent overlapping bookings per villa at the database layer.
-- This blocks race conditions where two clients submit at nearly the same time.

create extension if not exists btree_gist;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_date_order_check'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_date_order_check
      check (check_out > check_in);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_no_overlap_per_villa'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_no_overlap_per_villa
      exclude using gist (
        villa_id with =,
        daterange(check_in, check_out, '[)') with &&
      )
      where (booking_status <> 'cancelled');
  end if;
end $$;