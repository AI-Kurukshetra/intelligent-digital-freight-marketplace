create or replace function public.get_load_bids(
  p_load_id uuid
)
returns setof public.bids
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_load public.loads%rowtype;
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
    return query
    select public.bids.*
    from public.bids
    where public.bids.load_id = p_load_id
      and public.bids.carrier_id = auth.uid()
    order by public.bids.bid_price asc, public.bids.created_at desc;

    return;
  end if;

  return query
  select public.bids.*
  from public.bids
  where public.bids.load_id = p_load_id
  order by public.bids.bid_price asc, public.bids.created_at desc;
end;
$$;

grant execute on function public.get_load_bids(uuid) to authenticated;

notify pgrst, 'reload schema';
