## 2026-06-25 - Fix React Rules of Hooks and Duplicate State
**Bug:** Duplicate state variables (`clicking`, `hovering`) and an early return (`if (isTouchDevice) return null;`) before a `useEffect` hook in `CursorFollower.jsx`. This caused Vite build errors ("symbol has already been declared") and violated the Rules of Hooks (hooks cannot be called conditionally or after early returns).
**Root Cause:** Improper placement of early return statements and re-declaration of state variables in the functional component.
**Learning:** Always ensure `useState`, `useEffect`, and all other hooks are called at the top level of the component, before any conditional returns. Avoid declaring the same state variables twice.
