## 2024-04-30 - Fix Production Build Errors
**Bug:** The production build failed with duplicate state declarations and CSS `@import` ordering warnings.
**Root Cause:** The `clicking` and `hovering` state variables were declared twice in `CursorFollower.jsx`, and the Google Fonts `@import` was placed below `@import "tailwindcss"` in `index.css`, violating standard CSS import rules.
**Learning:** Always ensure state declarations are unique per component and prioritize external `@import` statements above Tailwind's base imports to prevent esbuild optimization errors.

## 2024-04-30 - Fix React Hooks Linting Error
**Bug:** A React hook `react-hooks/rules-of-hooks` violation was reported during code review.
**Root Cause:** An early return (`if (isTouchDevice) return null;`) was placed before the `useEffect` hook in `CursorFollower.jsx`, causing conditional execution of the hook.
**Learning:** Always ensure early return statements in React components are placed after all hook declarations to satisfy the rules of hooks.

## 2024-04-30 - Fix React ESLint Errors
**Bug:** CI checks failed due to various ESLint errors, including `jsx-a11y/anchor-is-valid`, `jsx-a11y/aria-role`, and unused variables.
**Root Cause:** Interactive elements used `<a>` tags with `href="#"` instead of `<button>`s. The `RoleCard` component accepted a `role` prop which clashed with the DOM ARIA `role` attribute.
**Learning:** Always use `<button>` tags for interactive actions instead of blank anchor tags to satisfy a11y standards. Avoid using `role` as a custom prop name in React components to prevent false positives from `jsx-a11y` rules.
