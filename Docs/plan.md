# End-to-End Build Plan (Step-by-Step, Error-Resistant)

This plan is ordered for safe delivery with checkpoints after every major block.

## Phase 0: Project Baseline and Safety

### Tasks
- [ ] Confirm Expo app boots with TypeScript strict mode enabled.
- [ ] Add lint, format, and typecheck scripts.
- [ ] Add environment validation on app startup.
- [ ] Add shared error logger helper.

### Validation Gate
- [ ] npm run lint passes.
- [ ] npm run typecheck passes.
- [ ] App opens on emulator/device without runtime red screen.

## Phase 1: Supabase Foundation

### Tasks
- [ ] Create Supabase schema migration files for core tables.
- [ ] Add RLS policies for each table.
- [ ] Create storage buckets: avatars, feedback-photos, floor-maps.
- [ ] Add generated TypeScript database types.
- [ ] Implement typed Supabase client and query helper wrappers.

### Validation Gate
- [ ] Migrations run in local/staging without errors.
- [ ] RLS test matrix passes for student and admin users.
- [ ] CRUD smoke test script returns expected results.

## Phase 2: Authentication and Session Routing

### Tasks
- [ ] Build sign-in and sign-up pages.
- [ ] Add session bootstrap in splash flow.
- [ ] Add role resolution from profiles table.
- [ ] Implement route guards for protected pages.

### Validation Gate
- [ ] Unauthenticated users are redirected to auth.
- [ ] Authenticated users land in home.
- [ ] Admin routes reject non-admin users.

## Phase 3: Core Design System in React Native

### Tasks
- [ ] Implement theme tokens from Stitch palette.
- [ ] Build reusable components: ClayCard, ClaySunkenInput, GlassHeader, BottomNav.
- [ ] Build shared spacing and typography utility constants.
- [ ] Add motion presets for press and transition animations.

### Validation Gate
- [ ] UI components render consistently on Android and iOS.
- [ ] No 1px hard borders in core tactile surfaces.
- [ ] Accessibility contrast checks pass for key text and action controls.

## Phase 4: Home + Search Feature Slice

### Tasks
- [ ] Implement Home page with recent destinations and quick actions.
- [ ] Implement Search page with debounced query and filters.
- [ ] Add recent searches persistence.
- [ ] Wire React Query caching and stale times.

### Validation Gate
- [ ] Search returns correct building results.
- [ ] Empty state shown when no matches.
- [ ] Pull-to-refresh updates data correctly.

## Phase 5: Map + Building Details + Route Feature Slice

### Tasks
- [ ] Add map rendering and current location marker.
- [ ] Add map marker taps to building details route.
- [ ] Implement building details with occupancy and floor selector.
- [ ] Implement route page with step-by-step instructions.
- [ ] Add route history persistence.

### Validation Gate
- [ ] Marker tap opens correct building details.
- [ ] Route distance and duration values are present.
- [ ] Building occupancy updates without full app restart.

## Phase 6: Profile + Preferences + Accessibility

### Tasks
- [ ] Build profile page with avatar upload.
- [ ] Add preferences toggles and persistence.
- [ ] Implement accessibility modes (high contrast, larger text).
- [ ] Implement notification permission and preference storage.

### Validation Gate
- [ ] Preference change survives app restart.
- [ ] Avatar upload and retrieval works from storage.
- [ ] Screen reader labels exist for all interactive elements.

## Phase 7: Feedback Pipeline

### Tasks
- [ ] Build feedback page with category, sentiment, text, photo.
- [ ] Add Zod schema validation.
- [ ] Save feedback + attachment metadata to Supabase.
- [ ] Add feedback status tracking UI.

### Validation Gate
- [ ] Invalid payloads are blocked client-side.
- [ ] Valid feedback is saved with proper user linkage.
- [ ] Photo uploads are retrievable only by allowed roles.

## Phase 8: Admin Console (In-App)

### Tasks
- [ ] Initialize admin route group in the mobile app.
- [ ] Implement admin auth guard.
- [ ] Build dashboard KPIs and trend charts.
- [ ] Build building CRUD + floor/room management.
- [ ] Build occupancy control panel.
- [ ] Build feedback moderation workflow.

### Validation Gate
- [ ] Admin CRUD updates are reflected in mobile app data.
- [ ] Non-admin users cannot access admin mutations.
- [ ] Moderation actions are audit logged.

## Phase 9: Realtime and Notifications

### Tasks
- [ ] Enable Supabase Realtime subscriptions for occupancy updates.
- [ ] Add in-app handlers for occupancy changes.
- [ ] Integrate Expo Notifications for reminders and route alerts.
- [ ] Add notification settings controls in profile.

### Validation Gate
- [ ] Occupancy updates appear within target latency.
- [ ] Notifications respect user settings and role constraints.

## Phase 10: Hardening and QA

### Tasks
- [ ] Add unit tests for validators and mappers.
- [ ] Add integration tests for API hooks.
- [x] Add E2E tests for search -> route -> feedback.
- [x] Add admin E2E tests for building update and moderation.
- [ ] Run performance pass on map and list rendering.

### Validation Gate
- [ ] Critical test suites pass in CI.
- [ ] Zero TypeScript errors.
- [ ] No blocker or critical bug remains open.

## Phase 11: Release Readiness

### Tasks
- [ ] Finalize production Supabase project and secrets.
- [ ] Execute migration verification on production clone.
- [ ] Configure monitoring and alerting.
- [x] Prepare release notes and rollback playbook.

### Validation Gate
- [ ] Production smoke tests pass.
- [ ] Rollback tested once.
- [ ] Stakeholder sign-off received.

## Task Execution Protocol (Use for Every Task)
1. Pick exactly one todo item.
2. Implement code in smallest safe diff.
3. Run lint and typecheck.
4. Run feature-specific test.
5. Verify loading, empty, and error states.
6. Verify auth and RLS behavior if backend changed.
7. Mark todo complete only after all checks pass.

## Daily Checklist
- [ ] Pull latest code and confirm clean branch state.
- [ ] Complete at least one end-to-end todo.
- [ ] Update docs if behavior changed.
- [ ] Record new risks and blockers.
- [ ] Keep open PR small and reviewable.

## Stop Conditions (Do Not Proceed Until Fixed)
- Any TypeScript error.
- Any failing migration.
- Any RLS policy gap allowing unauthorized data access.
- Any crash in splash, home, search, map, building, route, profile, or feedback flows.
