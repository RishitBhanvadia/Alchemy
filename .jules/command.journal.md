# Command Journal

## 2026-03-11 — Feature Silently Leaves Unused Variables Behind
**Pattern:** When the Feature agent removes significant chunks of UI or logic (such as background models or specific component cards), it frequently forgets to remove the corresponding imports and state variables, triggering multiple ESLint `no-unused-vars` errors.
**Detection:** ESLint fails during the CI pipeline with multiple `no-unused-vars` errors.
**Prevention:** Command must remind the Feature agent to run `npm run lint` and explicitly clean up any orphaned imports or state variables whenever they delete sections of code.
