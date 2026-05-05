# Command Journal

## 2026-05-05 — Github Actions CI Node 18 Deprecation
**Pattern:** CI checks across `.github/workflows/` (`build-check.yml`, `ci.yml`, `deploy-check.yml`) are throwing deprecation warnings for `node-version: 18` or `18.x`, and breaking builds as Node 20 setups deprecate/fail.
**Detection:** Github CI check run annotations (`Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected...`).
**Prevention:** Always verify CI workflows use `node-version: 20` or higher to prevent random pipeline failures from runtime deprecations.
