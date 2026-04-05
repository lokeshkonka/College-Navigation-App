# AI Agent Task Pack

Use these task briefs to execute implementation in controlled steps.

## Agent Task 1: Schema and RLS Builder

### Objective
Create and validate Supabase schema, indexes, and RLS from Architecture.md.

### Inputs
- Docs/Architecture.md
- Existing .env values

### Deliverables
- SQL migration files for all tables/views/indexes.
- RLS policies for user/admin roles.
- Seed script with sample campus/building data.

### Definition of Done
- Migration runs cleanly on fresh database.
- Student role cannot mutate admin resources.
- Admin role can manage buildings/occupancy/feedback status.

## Agent Task 2: Shared Mobile Foundation

### Objective
Set up typed Supabase client, query hooks base, and reusable clay UI components.

### Inputs
- Docs/Architecture.md
- Docs/Pages.md

### Deliverables
- src/services/supabase/client.ts
- src/components/ui clay component set
- Theme token map matching Stitch references

### Definition of Done
- Components render correctly on both platforms.
- Typecheck passes with strict mode.

## Agent Task 3: Core Screens Batch A

### Objective
Implement splash, home, and search pages with real queries.

### Inputs
- Docs/Pages.md sections 1-3

### Deliverables
- app/index.tsx
- app/(tabs)/home/index.tsx
- app/search/index.tsx
- Corresponding feature API modules

### Definition of Done
- Search works with debounce.
- Home shows dynamic recent destinations.
- Session gate works from splash.

## Agent Task 4: Core Screens Batch B

### Objective
Implement map, building details, and route pages with backend wiring.

### Inputs
- Docs/Pages.md sections 4-6

### Deliverables
- app/(tabs)/map/index.tsx
- app/building/[id].tsx
- app/route/index.tsx
- Route and occupancy query modules

### Definition of Done
- Marker to details navigation works.
- Route stats render from real data.
- Building occupancy updates reliably.

## Agent Task 5: Profile and Feedback

### Objective
Implement profile settings and feedback submission with validation.

### Inputs
- Docs/Pages.md sections 7-8

### Deliverables
- app/(tabs)/profile/index.tsx
- app/feedback/index.tsx
- Profile and feedback API modules

### Definition of Done
- Preferences persist server-side.
- Feedback form validates before submit.
- Optional photo upload path works.

## Agent Task 6: Admin Console Builder

### Objective
Create in-app admin console connected to same Supabase project.

### Inputs
- Docs/Architecture.md section 9
- Docs/Pages.md section 9

### Deliverables
- Admin auth guard
- Dashboard KPI page
- Building/occupancy/feedback management pages

### Definition of Done
- Admin CRUD changes are visible in mobile app.
- Non-admin user access is blocked.

## Agent Task 7: QA and Hardening Agent

### Objective
Enforce no-error quality gates and test critical flows.

### Inputs
- Docs/plan.md

### Deliverables
- Unit and integration test suites
- E2E smoke tests for core journeys
- Performance and accessibility checks summary

### Definition of Done
- Lint and typecheck pass.
- Core E2E path passes.
- No critical open bug remains.

## Agent Task 8: Release Agent

### Objective
Prepare staging/production rollout with rollback confidence.

### Inputs
- Docs/plan.md phase 11

### Deliverables
- Environment checklist
- Migration verification report
- Release note draft and rollback instructions

### Definition of Done
- Smoke tests pass on staging and production candidate.
- Rollback path tested and documented.

## Standard Agent Prompt Template

Use this template when running each task:

1. Read the relevant section from Docs.
2. Implement only the listed deliverables.
3. Keep diffs minimal and typed.
4. Run lint and typecheck.
5. Report changed files, tests run, and remaining risks.
