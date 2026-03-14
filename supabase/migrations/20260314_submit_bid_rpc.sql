create or replace function public.submit_bid(
  p_load_id uuid,
  p_bid_price numeric,
  p_message text default null
)
returns public.bids
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  auth_user auth.users%rowtype;
  profile_role public.user_role;
  resolved_role public.user_role;
  target_load public.loads%rowtype;
  bid_row public.bids;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_bid_price is null or p_bid_price <= 0 then
    raise exception 'Enter a valid bid.';
  end if;

  select *
  into target_load
  from public.loads
  where id = p_load_id;

  if target_load.id is null then
    raise exception 'This load no longer exists.';
  end if;

  if target_load.shipper_id = auth.uid() then
    raise exception 'You cannot bid on your own load.';
  end if;

  select *
  into auth_user
  from auth.users
  where id = auth.uid();

  select role
  into profile_role
  from public.users
  where id = auth.uid();

  resolved_role := coalesce(profile_role, (auth_user.raw_user_meta_data ->> 'role')::public.user_role, 'carrier');

  if resolved_role <> 'carrier' then
    raise exception 'Only carriers can submit bids.';
  end if;

  insert into public.bids (load_id, carrier_id, bid_price, message)
  values (p_load_id, auth.uid(), p_bid_price, nullif(trim(coalesce(p_message, '')), ''))
  on conflict (load_id, carrier_id) do update
  set
    bid_price = excluded.bid_price,
    message = excluded.message
  returning * into bid_row;

  return bid_row;
end;
$$;

grant execute on function public.submit_bid(uuid, numeric, text) to authenticated;

notify pgrst, 'reload schema';
