# Command Journal

## 2026-05-29 — Build Failure: Re-declared variables in CursorFollower.jsx
**Finding:** The build is failing because `clicking` and `hovering` state variables are declared twice in the same scope in `client/src/components/CursorFollower.jsx`.
**Learning:** Build checks are essential as they catch duplicate variables and syntax errors missed by passing tests or formatting.
**Prevention:** Future agents must ensure `npm run build` is executed before submitting any component changes to catch syntax and declaration issues.
