# Command Journal

## 2026-02-18 — Vitest Configuration & Mocking Issues
**Finding:** Vitest configuration in `client/` was missing an explicit `include` pattern, causing it to execute Playwright tests located in `client/tests/`.
**Learning:** Default Vitest behavior is too aggressive for repos with mixed test types (e.g., E2E + Unit).
**Prevention:** Always verify `vitest.config.js` explicitly includes only `src/` or excludes `tests/` when Playwright is present.

**Finding:** Tests using `vi.mock` failed because they relied on local variables defined with `const` before the mock, which Vitest hoists.
**Learning:** Vitest's hoisting mechanism requires using `vi.hoisted()` for variables used inside mock factories.
**Prevention:** Use `vi.hoisted()` or define mocks inline to avoid ReferenceErrors.
