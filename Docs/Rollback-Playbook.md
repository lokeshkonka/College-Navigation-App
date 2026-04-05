# Rollback Playbook

Date: 2026-04-05
Scope: Production release rollback for college-navigation-app

## Trigger Conditions

- Crash loop or critical user-facing error after release.
- Authentication failure for valid users.
- Unauthorized access regression due to policy/config issues.
- Severe route/navigation data inconsistency.

## Immediate Response (First 15 Minutes)

1. Pause rollout in CI/CD.
2. Announce incident status to stakeholders.
3. Capture release version, deployment time, and first observed failures.

## Application Rollback Steps

1. Re-deploy last known stable app build.
2. Repoint runtime configuration to prior stable release values if needed.
3. Re-run smoke tests on home, search, route, profile, and feedback flows.

## Database Rollback Steps

1. Determine whether new migration introduced the issue.
2. If yes, apply pre-tested down migration or restore snapshot from production clone strategy.
3. Re-run RLS checks for student and admin test accounts.

## Validation After Rollback

- [ ] Authentication flow works for existing users.
- [ ] Search to route journey succeeds.
- [ ] Feedback submission succeeds.
- [ ] Admin moderation actions function for admin role only.
- [ ] Alerts return to normal baseline.

## Closeout

1. Record rollback timeline and root cause hypothesis.
2. Create follow-up tasks for permanent fix.
3. Update release notes with rollback incident summary.