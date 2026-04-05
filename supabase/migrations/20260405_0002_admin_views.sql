create or replace view public.v_admin_kpis as
select
  (select count(*) from public.profiles) as total_users,
  (select count(*) from public.feedback where status = 'open') as open_feedback,
  (select count(*) from public.buildings where is_active = true) as active_buildings,
  (select coalesce(avg(occupancy_percent), 0)::int from public.occupancy_live) as avg_occupancy;
