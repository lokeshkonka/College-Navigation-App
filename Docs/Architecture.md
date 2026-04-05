# College Navigation App Architecture

## 1. Objective
Build a production-grade college navigation platform inspired by the Stitch visual references, while making the system flexible, maintainable, and admin-operable.

Primary goals:
- Keep the tactile claymorphism and editorial hierarchy from Stitch.
- Implement real data flows with Supabase as the full backend.
- Support one app with role-gated student and admin experiences.
- Enforce strict TypeScript, robust validation, and low-error development workflow.

## 2. UX Reference Translation (From Stitch)

Key retained UX characteristics:
- Soft claymorphism with raised/sunken surfaces.
- Glassy top bars and floating controls.
- Intentional asymmetry in card layouts.
- High contrast hierarchy: bold titles + tiny metadata labels.
- Fast-access actions: search, navigate, quick-stop chips, feedback.

Key upgrades for real app quality:
- Data-driven screens (not static placeholders).
- Proper empty/loading/error states.
- Realtime occupancy and route status updates.
- Role-based admin controls.
- Accessibility and offline-aware behavior.

## 3. System Context

### 3.1 Clients
- Mobile app: Expo + React Native + Expo Router.
- In-app admin console: role-gated routes inside the same Expo app.

### 3.2 Backend Platform
- Supabase Auth for user/admin authentication.
- Supabase PostgreSQL for relational data.
- Supabase Storage for images and floor plans.
- Supabase Realtime for occupancy and urgent map updates.
- Supabase Edge Functions for privileged server logic.

### 3.3 External Integrations
- Map rendering: react-native-maps or Mapbox.
- Routing engine: OpenRouteService or custom campus graph service.
- Notifications: Expo Notifications.

## 4. High-Level Architecture

```text
Single App (Expo RN)  ----> Supabase (Auth, Postgres, Storage, Realtime, Edge)

In-app Workspaces:
- Student and staff experience
- Role-gated admin console in the same app

Optional Integrations:
- Routing Provider API
- Campus timetable import service
- Sensor/IoT occupancy feeds
```

## 5. Repository-Oriented Module Architecture

```text
app/
  (auth)/
  (tabs)/
    home/
    map/
    profile/
  search/
  building/[id]/
  route/
  feedback/
  admin/
src/
  components/
    ui/
    map/
    forms/
    cards/
  features/
    auth/
    buildings/
    routes/
    map/
    occupancy/
    feedback/
    profile/
    admin/
  services/
    supabase/
    location/
    notifications/
    routing/
  store/
    useSessionStore.ts
    useUiStore.ts
    useNavigationStore.ts
  hooks/
  lib/
    zod/
    constants/
    utils/
  types/
```

## 6. Data Model (Supabase)

### 6.1 Core Tables
- profiles
  - id uuid pk references auth.users(id)
  - full_name text
  - avatar_url text
  - role text check in ('student','staff','admin','super_admin')
  - accessibility_prefs jsonb
  - created_at timestamptz

- campuses
  - id uuid pk
  - name text
  - timezone text

- buildings
  - id uuid pk
  - campus_id uuid references campuses(id)
  - name text
  - code text
  - description text
  - latitude numeric
  - longitude numeric
  - hours_json jsonb
  - tags text[]
  - is_active boolean

- building_floors
  - id uuid pk
  - building_id uuid references buildings(id)
  - floor_label text
  - map_image_path text
  - level_index int

- rooms
  - id uuid pk
  - building_id uuid references buildings(id)
  - floor_id uuid references building_floors(id)
  - room_name text
  - room_type text
  - capacity int
  - accessibility_tags text[]

- occupancy_live
  - building_id uuid pk references buildings(id)
  - occupancy_percent int
  - updated_at timestamptz

- occupancy_history
  - id bigserial pk
  - building_id uuid references buildings(id)
  - occupancy_percent int
  - captured_at timestamptz

- routes
  - id uuid pk
  - origin_building_id uuid references buildings(id)
  - destination_building_id uuid references buildings(id)
  - distance_m int
  - duration_min int
  - path_geojson jsonb
  - is_accessible boolean

- favorites
  - user_id uuid references profiles(id)
  - building_id uuid references buildings(id)
  - created_at timestamptz
  - primary key (user_id, building_id)

- recent_destinations
  - id bigserial pk
  - user_id uuid references profiles(id)
  - building_id uuid references buildings(id)
  - visited_at timestamptz

- feedback
  - id uuid pk
  - user_id uuid references profiles(id)
  - category text check in ('general','report_error','suggestion')
  - sentiment int check (sentiment between 1 and 5)
  - message text
  - route_id uuid null references routes(id)
  - building_id uuid null references buildings(id)
  - status text check in ('open','triaged','resolved','rejected')
  - created_at timestamptz

- feedback_attachments
  - id uuid pk
  - feedback_id uuid references feedback(id)
  - file_path text
  - created_at timestamptz

- notifications
  - id uuid pk
  - user_id uuid references profiles(id)
  - type text
  - title text
  - body text
  - read_at timestamptz null
  - created_at timestamptz

### 6.2 Indexes
- buildings using gin(tags)
- buildings on (campus_id, is_active)
- occupancy_history on (building_id, captured_at desc)
- feedback on (status, created_at desc)
- recent_destinations on (user_id, visited_at desc)

## 7. Security and Access Control

### 7.1 Roles
- student: app usage, create feedback, view active campus data.
- staff: same as student + optional internal reports.
- admin: manage buildings, floors, occupancy, feedback status.
- super_admin: manage admins and critical settings.

### 7.2 RLS Strategy
- Public read for active campus/building metadata.
- User-scoped read/write for favorites, profile, recent destinations, own feedback.
- Admin-only mutation on buildings, occupancy, moderation fields.
- Storage policies:
  - avatars: owner write, public read optional.
  - feedback-photos: owner write, admin read.
  - floor-maps: admin write, app read.

### 7.3 Edge Functions (Privileged)
- admin-upsert-building
- admin-upsert-floor
- admin-update-occupancy
- feedback-moderation
- route-recompute

## 8. Frontend Architecture

### 8.1 State Layers
- Zustand for local UI/session/navigation states.
- React Query for server state and cache control.
- React Hook Form + Zod for all forms.

### 8.2 Query Key Convention
- ['buildings', filters]
- ['building', buildingId]
- ['occupancy', buildingId]
- ['route', originId, destinationId, pref]
- ['feedback', userId, page]

### 8.3 Error Handling
- Global query error boundary.
- Mutations return typed domain errors.
- Offline fallback to cached data with stale badge.

## 9. Admin Console Architecture

The admin workspace is implemented in-app under role-gated Expo routes.

### 9.1 Admin Areas
- Dashboard: occupancy trends, busiest buildings, unresolved feedback.
- Buildings: CRUD for building and floor data.
- Routes: recompute and validate path quality.
- Feedback Moderation: triage queue and response tracking.
- User Ops: role assignments and audit logs.

### 9.2 Admin Core Features
- Table + drawer edit workflows.
- Bulk CSV import for rooms/buildings.
- Activity log trail for sensitive actions.
- Role-guarded routes and server checks.

## 10. UI System Adaptation for React Native

Mapped design tokens:
- color.background = #f8f9fb
- color.surface = #ffffff
- color.surfaceSunken = #dbe4ea
- color.primary = #586062
- color.tertiary = #006c56
- radius.card = 24
- radius.pill = 999
- spacing.section = 28

Component kit:
- ClayCard
- ClaySunkenInput
- FloatingGlassHeader
- StickyBottomNav
- OccupancyBadge
- RouteStepCard
- FeedbackSentimentPicker

Design rule to preserve:
- Prefer tonal boundaries and spacing over hard lines.

## 11. Performance and Reliability
- Pagination for search and feedback lists.
- Debounced search (300-400ms).
- Realtime only where needed (occupancy, urgent announcements).
- Cache stale time by feature:
  - buildings: 5 minutes
  - occupancy: 20-30 seconds
  - profile: 2 minutes
- Track slow queries and add missing indexes from query plans.

## 12. Testing Strategy
- Unit tests: utilities, mappers, validators.
- Integration tests: feature hooks with mocked Supabase.
- E2E tests: critical journeys (search -> route -> feedback).
- Admin E2E: building update and moderation workflow.

## 13. Deployment Strategy
- Environments:
  - local
  - staging
  - production
- Supabase projects separated per environment.
- Managed migrations and seed scripts.
- Feature flags for staged rollouts.

## 14. Architecture TODO Checklist

- [ ] Finalize database schema and relationships.
- [ ] Implement RLS policies for all tables and storage buckets.
- [ ] Build Supabase typed client and shared query helpers.
- [ ] Implement feature-based frontend module boundaries.
- [ ] Build reusable clay component library in React Native.
- [ ] Wire realtime occupancy subscriptions.
- [ ] Implement in-app admin console with role guards.
- [ ] Add migration + seed + rollback scripts.
- [ ] Add automated tests and CI checks.
- [ ] Run load and query performance validation.
- [ ] Complete security and privacy review.

## 15. Recommended Execution Order
1. Database + RLS + typed queries.
2. Auth/session and route guards.
3. Core user flows: Home, Search, Map, Building, Route.
4. Feedback upload flow and moderation queue.
5. In-app admin console CRUD and analytics.
6. Notifications, polish, performance, and release hardening.
