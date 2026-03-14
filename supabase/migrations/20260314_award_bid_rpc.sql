alter table public.loads add column if not exists awarded_bid_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'loads_awarded_bid_id_fkey'
  ) then
    alter table public.loads
      add constraint loads_awarded_bid_id_fkey
      foreign key (awarded_bid_id)
      references public.bids (id)
      on delete set null;
  end if;
end $$;

create or replace function public.award_bid(
  p_load_id uuid,
  p_bid_id uuid
)
returns public.loads
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_load public.loads%rowtype;
  target_bid public.bids%rowtype;
  updated_load public.loads;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select *
  into target_load
  from public.loads
  where id = p_load_id;

  if target_load.id is null then
    raise exception 'Load not found';
  end if;

  if target_load.shipper_id <> auth.uid() then
    raise exception 'Forbidden';
  end if;

  select *
  into target_bid
  from public.bids
  where id = p_bid_id;

  if target_bid.id is null then
    raise exception 'Bid not found';
  end if;

  if target_bid.load_id <> p_load_id then
    raise exception 'Bid does not belong to this load';
  end if;

  update public.loads
  set
    awarded_bid_id = p_bid_id,
    status = 'awarded'
  where id = p_load_id
  returning * into updated_load;

  return updated_load;
end;
$$;

grant execute on function public.award_bid(uuid, uuid) to authenticated;

notify pgrst, 'reload schema';
