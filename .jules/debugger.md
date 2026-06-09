## 2024-06-09 - Fix React Hook conditional call in CursorFollower
**Bug:** The `useEffect` hook in `client/src/components/CursorFollower.jsx` was being called conditionally because it was placed after an early return (`if (isTouchDevice) return null;`). This violates the Rules of Hooks and causes a React compilation/linting error (`react-hooks/rules-of-hooks`). There was also a syntax parsing error due to duplicate variable declarations for `clicking` and `hovering`.
**Root Cause:** The early return for touch devices was placed before the `useEffect` and duplicate `useState` declarations were present.
**Learning:** Always ensure `useEffect` and other React hooks are called at the top level of a component, before any conditional returns. When resolving `react-hooks/rules-of-hooks` errors, carefully inspect the position of early returns relative to hooks.

## 2024-06-09 - Fix React ARIA Role Conflict and Anchor Tags
**Bug:** The CI build failed due to multiple ESLint errors, including unused imports, invalid `href` attributes in anchor tags (`jsx-a11y/anchor-is-valid`), and a conflict where a custom component prop named `role` triggered `jsx-a11y/aria-role` errors.
**Root Cause:** Custom component props named `role` conflict with HTML ARIA attributes in ESLint plugins. Anchor tags without valid navigation targets were used for interactive elements. Unused imports caused strict linter failures.
**Learning:** Always use `roleType` instead of `role` for custom component props to avoid ARIA role conflicts in ESLint. Replace non-navigating `<a>` tags (e.g., `<a href="#">`) with `<button type="button">` to ensure accessibility and pass `jsx-a11y/anchor-is-valid` rules. Regularly run the linter locally and address warnings to prevent CI failures.
