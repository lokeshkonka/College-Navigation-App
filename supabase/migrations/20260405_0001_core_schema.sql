create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'staff', 'admin', 'super_admin')),
  accessibility_prefs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'UTC'
);

create table if not exists public.buildings (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid references public.campuses(id),
  name text not null,
  code text not null unique,
  description text,
  latitude numeric not null,
  longitude numeric not null,
  hours_json jsonb,
  tags text[] not null default '{}',
  is_active boolean not null default true
);

create table if not exists public.building_floors (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  floor_label text not null,
  map_image_path text,
  level_index integer not null
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  floor_id uuid not null references public.building_floors(id) on delete cascade,
  room_name text not null,
  room_type text,
  capacity integer,
  accessibility_tags text[] not null default '{}'
);

create table if not exists public.occupancy_live (
  building_id uuid primary key references public.buildings(id) on delete cascade,
  occupancy_percent integer not null check (occupancy_percent between 0 and 100),
  updated_at timestamptz not null default now()
);

create table if not exists public.occupancy_history (
  id bigserial primary key,
  building_id uuid not null references public.buildings(id) on delete cascade,
  occupancy_percent integer not null check (occupancy_percent between 0 and 100),
  captured_at timestamptz not null default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  origin_building_id uuid not null references public.buildings(id) on delete cascade,
  destination_building_id uuid not null references public.buildings(id) on delete cascade,
  distance_m integer not null check (distance_m >= 0),
  duration_min integer not null check (duration_min >= 0),
  path_geojson jsonb,
  is_accessible boolean not null default false
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, building_id)
);

create table if not exists public.recent_destinations (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade,
  visited_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('general', 'report_error', 'suggestion')),
  sentiment integer not null check (sentiment between 1 and 5),
  message text not null,
  route_id uuid null references public.routes(id) on delete set null,
  building_id uuid null references public.buildings(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'triaged', 'resolved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_attachments (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  file_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_actions (
  id bigserial primary key,
  feedback_id uuid not null references public.feedback(id) on delete cascade,
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.route_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  origin_building_id uuid not null references public.buildings(id) on delete cascade,
  destination_building_id uuid not null references public.buildings(id) on delete cascade,
  is_accessible boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_buildings_tags on public.buildings using gin(tags);
create index if not exists idx_buildings_campus_active on public.buildings (campus_id, is_active);
create index if not exists idx_buildings_name_trgm on public.buildings using gin (name gin_trgm_ops);
create index if not exists idx_occupancy_history_building_time on public.occupancy_history (building_id, captured_at desc);
create index if not exists idx_feedback_status_created on public.feedback (status, created_at desc);
create index if not exists idx_recent_destinations_user_time on public.recent_destinations (user_id, visited_at desc);

create or replace view public.v_recent_destinations as
select
  rd.id,
  rd.user_id,
  rd.building_id,
  b.name as building_name,
  rd.visited_at
from public.recent_destinations rd
join public.buildings b on b.id = rd.building_id;

create or replace view public.v_building_details as
select
  b.id,
  b.name,
  b.code,
  b.description,
  b.latitude,
  b.longitude,
  b.tags,
  b.is_active,
  b.hours_json,
  coalesce(ol.occupancy_percent, 0) as occupancy_percent
from public.buildings b
left join public.occupancy_live ol on ol.building_id = b.id;

create or replace function public.is_admin() returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('admin', 'super_admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.buildings enable row level security;
alter table public.building_floors enable row level security;
alter table public.rooms enable row level security;
alter table public.occupancy_live enable row level security;
alter table public.occupancy_history enable row level security;
alter table public.routes enable row level security;
alter table public.favorites enable row level security;
alter table public.recent_destinations enable row level security;
alter table public.feedback enable row level security;
alter table public.feedback_attachments enable row level security;
alter table public.notifications enable row level security;
alter table public.feedback_actions enable row level security;
alter table public.route_requests enable row level security;

create policy profiles_owner_read on public.profiles
for select using (auth.uid() = id or public.is_admin());

create policy profiles_owner_update on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy buildings_public_read on public.buildings
for select using (is_active = true or public.is_admin());

create policy buildings_admin_write on public.buildings
for all using (public.is_admin()) with check (public.is_admin());

create policy building_floors_public_read on public.building_floors
for select using (true);

create policy building_floors_admin_write on public.building_floors
for all using (public.is_admin()) with check (public.is_admin());

create policy rooms_public_read on public.rooms
for select using (true);

create policy rooms_admin_write on public.rooms
for all using (public.is_admin()) with check (public.is_admin());

create policy occupancy_live_public_read on public.occupancy_live
for select using (true);

create policy occupancy_live_admin_write on public.occupancy_live
for all using (public.is_admin()) with check (public.is_admin());

create policy occupancy_history_public_read on public.occupancy_history
for select using (true);

create policy occupancy_history_admin_write on public.occupancy_history
for all using (public.is_admin()) with check (public.is_admin());

create policy routes_public_read on public.routes
for select using (true);

create policy routes_admin_write on public.routes
for all using (public.is_admin()) with check (public.is_admin());

create policy favorites_owner_read on public.favorites
for select using (auth.uid() = user_id);

create policy favorites_owner_write on public.favorites
for insert with check (auth.uid() = user_id);

create policy favorites_owner_delete on public.favorites
for delete using (auth.uid() = user_id);

create policy recent_destinations_owner_read on public.recent_destinations
for select using (auth.uid() = user_id);

create policy recent_destinations_owner_write on public.recent_destinations
for insert with check (auth.uid() = user_id);

create policy feedback_owner_read on public.feedback
for select using (auth.uid() = user_id or public.is_admin());

create policy feedback_owner_insert on public.feedback
for insert with check (auth.uid() = user_id);

create policy feedback_admin_update on public.feedback
for update using (public.is_admin()) with check (public.is_admin());

create policy feedback_attachments_owner_read on public.feedback_attachments
for select using (
  exists (
    select 1
    from public.feedback f
    where f.id = feedback_id
      and (f.user_id = auth.uid() or public.is_admin())
  )
);

create policy feedback_attachments_owner_write on public.feedback_attachments
for insert with check (
  exists (
    select 1
    from public.feedback f
    where f.id = feedback_id
      and f.user_id = auth.uid()
  )
);

create policy notifications_owner_read on public.notifications
for select using (auth.uid() = user_id);

create policy notifications_owner_update on public.notifications
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy feedback_actions_admin_read on public.feedback_actions
for select using (public.is_admin());

create policy feedback_actions_admin_write on public.feedback_actions
for all using (public.is_admin()) with check (public.is_admin());

create policy route_requests_owner_read on public.route_requests
for select using (auth.uid() = user_id or public.is_admin());

create policy route_requests_owner_insert on public.route_requests
for insert with check (auth.uid() = user_id);
