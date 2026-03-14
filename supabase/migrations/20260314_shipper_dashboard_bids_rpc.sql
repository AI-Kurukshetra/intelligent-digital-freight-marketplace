create or replace function public.get_shipper_dashboard_bids(
  p_shipper_id uuid
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

  if auth.uid() <> p_shipper_id then
    raise exception 'Forbidden';
  end if;

  return query
  select public.bids.*
  from public.bids
  inner join public.loads on public.loads.id = public.bids.load_id
  where public.loads.shipper_id = p_shipper_id
  order by public.bids.created_at desc;
end;
$$;

grant execute on function public.get_shipper_dashboard_bids(uuid) to authenticated;

notify pgrst, 'reload schema';
