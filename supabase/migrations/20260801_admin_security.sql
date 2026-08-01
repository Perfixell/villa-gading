-- Admin authorization and least-privilege Row Level Security policies.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.bookings enable row level security;
alter table public.villas enable row level security;
alter table public.pricing_periods enable row level security;

-- Remove any older permissive policies before installing the rules below.
do $$
declare existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('admin_users', 'bookings', 'villas', 'pricing_periods')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  end loop;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Public can read villas" on public.villas;
create policy "Public can read villas" on public.villas
  for select to anon, authenticated using (true);

drop policy if exists "Public can read active pricing" on public.pricing_periods;
create policy "Public can read active pricing" on public.pricing_periods
  for select to anon using (active = true);

drop policy if exists "Admins can read all pricing" on public.pricing_periods;
create policy "Admins can read all pricing" on public.pricing_periods
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can insert pricing" on public.pricing_periods;
create policy "Admins can insert pricing" on public.pricing_periods
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update pricing" on public.pricing_periods;
create policy "Admins can update pricing" on public.pricing_periods
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete pricing" on public.pricing_periods;
create policy "Admins can delete pricing" on public.pricing_periods
  for delete to authenticated using (public.is_admin());

drop policy if exists "Admins can read bookings" on public.bookings;
create policy "Admins can read bookings" on public.bookings
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings" on public.bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke insert, delete on public.admin_users from anon, authenticated;
revoke all on public.bookings from anon;
grant select, update on public.bookings to authenticated;
grant select on public.villas to anon, authenticated;
grant select on public.pricing_periods to anon;
grant select, insert, update, delete on public.pricing_periods to authenticated;

do $$
begin
  if to_regclass('public.pricing_periods_id_seq') is not null then
    execute 'grant usage, select on sequence public.pricing_periods_id_seq to authenticated';
  end if;
end $$;
