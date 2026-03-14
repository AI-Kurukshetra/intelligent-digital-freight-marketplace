create or replace function public.get_carrier_dashboard_bids(
  p_carrier_id uuid
)
returns setof public.bids
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if auth.uid() <> p_carrier_id then
    raise exception 'Forbidden';
  end if;

  return query
  select public.bids.*
  from public.bids
  where public.bids.carrier_id = p_carrier_id
  order by public.bids.created_at desc;
end;
$$;

grant execute on function public.get_carrier_dashboard_bids(uuid) to authenticated;

notify pgrst, 'reload schema';
