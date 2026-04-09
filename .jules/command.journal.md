# Command Journal

## 2026-02-24 — Vitest/Playwright Conflict & Mock Hoisting
**Finding:** Vitest configuration was too broad (`src/**/*.test.jsx` vs `tests/*.spec.js`) causing it to run Playwright E2E tests, which failed due to missing Playwright context.
**Learning:** Always verify test runner configuration excludes E2E directories when using mixed testing strategies.
**Prevention:** Command should check `vitest.config.js` `exclude` array specifically for `tests/` or wherever E2E tests are located.

**Finding:** `vi.mock` in `Login.test.jsx` failed due to hoisting issues with variables used in the factory.
**Learning:** Variables used in `vi.mock` factories must be hoisted or defined inside the factory. This is a strict requirement of Vitest.
**Prevention:** Lint rules or static analysis could catch this, but runtime failure is the primary detector.

**Finding:** `Dashboard.test.jsx` failed due to outdated text expectations ("Dashboard" vs "WELCOME, ADMIN").
**Learning:** UI text changes are not being reflected in tests, indicating a lack of TDD or pre-commit test running during feature development.
**Prevention:** Enforce pre-commit hooks that run relevant tests.
