# Command Journal

## 2026-04-08 — Duplicate Hook Declarations in React
**Pattern:** React components sometimes have duplicated hook declarations (e.g., `useState`) added accidentally after an early return during refactoring or updates.
**Detection:** This causes ESLint `no-redeclare` or `Identifier has already been declared` errors, and the build fails via esbuild due to duplicate declarations. Furthermore, React strictly prohibits calling hooks conditionally or after an early return.
**Prevention:** Always verify that state hooks are declared exactly once, and always at the top level of the component before any early return statements.

## 2026-04-08 — Role Prop Conflict
**Pattern:** Using a prop named `role` for custom logic (e.g., user types) on components that wrap native HTML elements conflicts with the ARIA `role` attribute, triggering `jsx-a11y/aria-role` lint errors.
**Detection:** ESLint errors like "Elements with ARIA roles must use a valid, non-abstract ARIA role".
**Prevention:** Use alternative names for custom role-related props, such as `roleType`, `userRole`, or `accountType`, to avoid conflicts with native HTML ARIA properties.
