# Command Journal

## 2026-02-18 — Vitest Runs Playwright Tests
**Finding:** Vitest configuration lacks `exclude` for the `tests/` directory where Playwright specs reside.
**Learning:** Default Vitest config is insufficient for mixed test environments.
**Prevention:** Command should check `vitest.config.js` for `exclude` patterns matching `tests/` or `e2e/` when both `vitest` and `@playwright/test` are present in `package.json`.
