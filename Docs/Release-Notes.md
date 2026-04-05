# Release Notes

Version: 1.0.0-rc
Date: 2026-04-05

## Highlights

- Completed single-app architecture with in-app admin console.
- Added role-gated admin routes for dashboard, buildings, occupancy, and feedback moderation.
- Integrated realtime occupancy subscription updates.
- Added notification setup and route reminder scheduling hooks.
- Expanded automated coverage with validator, mapper, and API integration tests.

## Quality Status

- Lint: PASS
- Typecheck: PASS
- Test suite: PASS
- Web export build: PASS

## Known Limitations

- Production clone migration evidence is still a manual release gate.
- Monitoring/alert destinations must be confirmed per deployment environment.

## Upgrade Notes

- Ensure required environment variables are configured before deployment.
- Run npm run release:check in CI for release candidate builds.