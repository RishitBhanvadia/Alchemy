# Command Journal

## 2026-03-05 — Vitest Executing Playwright Tests
**Finding:** Vitest configuration in `client/vitest.config.js` did not properly exclude Playwright tests located in `client/tests/`.
**Learning:** By default, Vitest looks for `.spec.js` and `.test.js` files anywhere. The `tests/` directory must be explicitly excluded.
**Prevention:** Command should always verify `vitest.config.js` excludes `tests/**` when both tools are used in the same project.

## 2026-03-05 — Vitest vi.mock Hoisting Reference Errors
**Finding:** `vi.mock` factory functions referencing externally declared mock variables (e.g. `mockSignInWithPassword`) throw `ReferenceError: Cannot access '...' before initialization`.
**Learning:** Vitest hoists `vi.mock` to the top of the file before variables are instantiated. Passing the function directly accesses it too early.
**Prevention:** Command should check that `vi.mock` factory functions use an inline wrapper `(...args) => mockVar(...args)` for external mocks.

## 2026-03-05 — Stale Test Assertions
**Finding:** UI changes made to the `Dashboard` title ("WELCOME, ADMIN") broke test assertions looking for outdated text.
**Learning:** Components are frequently updated without updating the corresponding test.
**Prevention:** Agent modifying a UI component should proactively check and update related `__tests__` files in the same directory.
