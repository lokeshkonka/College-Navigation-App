# Environment Checklist (Phase 11)

Date: 2026-04-05
Owner: Release Agent

## 1) Supabase Project and Secrets

- [ ] Confirm production Supabase project is selected in deployment pipeline.
- [ ] Confirm EXPO_PUBLIC_SUPABASE_URL points to production project.
- [ ] Confirm EXPO_PUBLIC_SUPABASE_KEY points to production anon key.
- [ ] Confirm service role key is stored only in secure CI secret storage.
- [ ] Confirm auth redirect URLs match production app domains.

## 2) Database and Policies

- [ ] Confirm all migrations are applied in order.
- [ ] Confirm RLS is enabled on all sensitive tables.
- [ ] Confirm admin-only mutations are blocked for non-admin users.
- [ ] Confirm storage buckets and permissions are in expected state.

## 3) Observability and Alerting

- [ ] Configure error reporting sink for runtime exceptions.
- [ ] Configure alert rule for API error-rate spike.
- [ ] Configure alert rule for repeated auth failures.
- [ ] Configure alert rule for failing health/smoke checks.

## 4) App-Level Release Inputs

- [ ] Bump application version/build metadata.
- [ ] Review release notes and known limitations.
- [ ] Confirm rollback playbook is up to date.
- [ ] Confirm release approvers are assigned.

## 5) Final Go/No-Go

- [ ] Run npm run release:check on release candidate.
- [ ] Execute production smoke tests.
- [ ] Capture sign-off from stakeholders.