# Command Journal

## 2025-02-25 — Initial Review Findings
**Finding:** `npm test` fails because Vitest picks up Playwright tests in `client/tests/`.
**Learning:** Playwright and Vitest co-existence requires explicit exclusion in `vitest.config.js`.
**Prevention:** Command should check `vitest.config.js` for `exclude` patterns when both tools are present.

## 2025-02-25 — CSS Syntax Error
**Finding:** `npm run build` warned about orphan CSS properties in `titration.css`.
**Learning:** CSS syntax errors can pass silently in dev but cause build warnings.
**Prevention:** Run build check and grep for "css-syntax-error" in output.
