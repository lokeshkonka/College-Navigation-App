# Release Runbook

Date: 2026-04-05
Release: 1.0.0-rc

## Owners

- Release owner: ____________________
- Engineering approver: ____________________
- Product approver: ____________________
- On-call responder: ____________________

## Preconditions

1. Complete environment checks in [Docs/Environment-Checklist.md](Docs/Environment-Checklist.md).
2. Confirm migration evidence in [Docs/Migration-Verification-Report.md](Docs/Migration-Verification-Report.md).
3. Review release notes in [Docs/Release-Notes.md](Docs/Release-Notes.md).
4. Confirm rollback readiness in [Docs/Rollback-Playbook.md](Docs/Rollback-Playbook.md).
5. Confirm alert setup from [Docs/Monitoring-Alerting-Config.md](Docs/Monitoring-Alerting-Config.md).

## Execution Steps

1. Run local quality gates:
   - npm run release:check
2. Deploy release candidate to staging.
3. Execute smoke tests for:
   - Auth sign-in/sign-up
   - Search -> route -> feedback journey
   - Admin building update and feedback moderation
4. Collect stakeholder approvals.
5. Release to production window.

## Production Smoke Checklist

- [ ] Splash and session bootstrap succeed.
- [ ] Search returns expected building results.
- [ ] Route details render with distance and duration.
- [ ] Feedback submission succeeds for authenticated user.
- [ ] Admin updates building data successfully.
- [ ] Admin moderation writes feedback action logs.

## Rollback Trigger and Action

- If any critical smoke check fails, execute [Docs/Rollback-Playbook.md](Docs/Rollback-Playbook.md) immediately.

## Sign-off

- Engineering: ____________________ Date: __________
- Product: ____________________ Date: __________
- Operations: ____________________ Date: __________