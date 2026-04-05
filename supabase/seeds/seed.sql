insert into public.campuses (id, name, timezone)
values
  ('d3e2c73f-e4f8-4733-95dd-f884f9089f4a', 'North Campus', 'Asia/Kolkata')
on conflict (id) do nothing;

insert into public.buildings (id, campus_id, name, code, description, latitude, longitude, tags, is_active, hours_json)
values
  (
    '3f5f8fe1-b233-47c3-88e3-735fd2b3fab1',
    'd3e2c73f-e4f8-4733-95dd-f884f9089f4a',
    'Main Library',
    'LIB',
    'Central library with silent and collaborative spaces.',
    12.9718,
    77.5948,
    array['library', 'study'],
    true,
    '{"mon":"08:00-20:00","tue":"08:00-20:00","wed":"08:00-20:00","thu":"08:00-20:00","fri":"08:00-18:00"}'::jsonb
  ),
  (
    '5f4f75db-4516-4e79-a4e8-2486ce2f7159',
    'd3e2c73f-e4f8-4733-95dd-f884f9089f4a',
    'Engineering Block',
    'ENG',
    'Labs and classrooms for engineering programs.',
    12.9724,
    77.5952,
    array['labs', 'classrooms'],
    true,
    '{"mon":"08:00-19:00","tue":"08:00-19:00","wed":"08:00-19:00","thu":"08:00-19:00","fri":"08:00-17:00"}'::jsonb
  ),
  (
    '34fca04a-7212-48db-bf8b-324c8fd9d101',
    'd3e2c73f-e4f8-4733-95dd-f884f9089f4a',
    'Student Center',
    'STU',
    'Food court, clubs, and student support office.',
    12.9712,
    77.5942,
    array['dining', 'services'],
    true,
    '{"mon":"07:00-21:00","tue":"07:00-21:00","wed":"07:00-21:00","thu":"07:00-21:00","fri":"07:00-21:00"}'::jsonb
  )
on conflict (id) do nothing;

insert into public.occupancy_live (building_id, occupancy_percent)
values
  ('3f5f8fe1-b233-47c3-88e3-735fd2b3fab1', 58),
  ('5f4f75db-4516-4e79-a4e8-2486ce2f7159', 64),
  ('34fca04a-7212-48db-bf8b-324c8fd9d101', 38)
on conflict (building_id) do update set occupancy_percent = excluded.occupancy_percent, updated_at = now();

insert into public.routes (id, origin_building_id, destination_building_id, distance_m, duration_min, is_accessible)
values
  (
    'f9f0aeb3-b9e2-4f7a-ae0d-8a4268efb613',
    '3f5f8fe1-b233-47c3-88e3-735fd2b3fab1',
    '5f4f75db-4516-4e79-a4e8-2486ce2f7159',
    620,
    9,
    true
  )
on conflict (id) do nothing;
