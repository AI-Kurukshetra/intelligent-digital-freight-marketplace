create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('shipper', 'carrier');
  end if;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role public.user_role not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.loads (
  id uuid primary key default gen_random_uuid(),
  shipper_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  pickup_location text not null,
  delivery_location text not null,
  cargo_type text not null,
  weight numeric(10, 2) not null check (weight > 0),
  price_estimate numeric(10, 2) not null check (price_estimate > 0),
  pickup_date date not null,
  status text not null default 'open' check (status in ('open', 'awarded')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  load_id uuid not null references public.loads (id) on delete cascade,
  carrier_id uuid not null references public.users (id) on delete cascade,
  bid_price numeric(10, 2) not null check (bid_price > 0),
  message text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (load_id, carrier_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'carrier')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    role = excluded.role;

  return new;
end;
$$;

create or replace function public.ensure_user_profile()
returns public.users
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  auth_user auth.users%rowtype;
  resolved_role public.user_role;
  profile public.users;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select *
  into auth_user
  from auth.users
  where id = auth.uid();

  if auth_user.id is null then
    raise exception 'Authenticated user not found';
  end if;

  resolved_role := coalesce((auth_user.raw_user_meta_data ->> 'role')::public.user_role, 'carrier');

  insert into public.users (id, email, role)
  values (auth_user.id, auth_user.email, resolved_role)
  on conflict (id) do update
  set
    email = excluded.email,
    role = excluded.role
  returning * into profile;

  return profile;
end;
$$;

grant execute on function public.ensure_user_profile() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.loads enable row level security;
alter table public.bids enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can create own profile" on public.users;
create policy "Users can create own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can read counterparties on owned loads" on public.users;
create policy "Users can read counterparties on owned loads"
on public.users
for select
to authenticated
using (
  exists (
    select 1
    from public.bids
    inner join public.loads on public.loads.id = public.bids.load_id
    where public.bids.carrier_id = public.users.id
      and public.loads.shipper_id = auth.uid()
  )
);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
on public.users
for update
to authenticated
using (auth.uid() = id);

insert into public.users (id, email, role)
select
  id,
  email,
  coalesce((raw_user_meta_data ->> 'role')::public.user_role, 'carrier')
from auth.users
where email is not null
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role;

drop policy if exists "Authenticated users can browse loads" on public.loads;
create policy "Authenticated users can browse loads"
on public.loads
for select
using (true);

drop policy if exists "Shippers can create loads" on public.loads;
create policy "Shippers can create loads"
on public.loads
for insert
to authenticated
with check (
  auth.uid() = shipper_id
  and exists (
    select 1
    from public.users
    where id = auth.uid() and role = 'shipper'
  )
  or (
    auth.uid() = shipper_id
    and coalesce((auth.jwt() -> 'user_metadata' ->> 'role')::public.user_role, 'carrier') = 'shipper'
  )
);

drop policy if exists "Shippers can manage own loads" on public.loads;
create policy "Shippers can manage own loads"
on public.loads
for update
to authenticated
using (auth.uid() = shipper_id)
with check (auth.uid() = shipper_id);

drop policy if exists "Carriers and shippers can read related bids" on public.bids;
create policy "Carriers and shippers can read related bids"
on public.bids
for select
to authenticated
using (
  auth.uid() = carrier_id
  or exists (
    select 1 from public.loads
    where public.loads.id = load_id and public.loads.shipper_id = auth.uid()
  )
);

drop policy if exists "Carriers can submit bids" on public.bids;
create policy "Carriers can submit bids"
on public.bids
for insert
to authenticated
with check (
  auth.uid() = carrier_id
  and exists (
    select 1
    from public.users
    where id = auth.uid() and role = 'carrier'
  )
  or (
    auth.uid() = carrier_id
    and coalesce((auth.jwt() -> 'user_metadata' ->> 'role')::public.user_role, 'shipper') = 'carrier'
  )
);

drop policy if exists "Carriers can update own bids" on public.bids;
create policy "Carriers can update own bids"
on public.bids
for update
to authenticated
using (auth.uid() = carrier_id)
with check (auth.uid() = carrier_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'loads'
  ) then
    alter publication supabase_realtime add table public.loads;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bids'
  ) then
    alter publication supabase_realtime add table public.bids;
  end if;
end $$;
