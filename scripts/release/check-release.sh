#!/usr/bin/env bash
set -euo pipefail

echo "[release-check] Starting release readiness checks"

echo "[release-check] Running lint"
npm run lint

echo "[release-check] Running typecheck"
npm run typecheck

echo "[release-check] Running tests"
npm run test

echo "[release-check] Building web export"
npm run build:web

echo "[release-check] All checks passed"
echo "[release-check] Update Docs/Migration-Verification-Report.md with the final environment-specific results before release."