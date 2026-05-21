## 2024-05-21 - Fix CursorFollower Hooks Rule Violation
**Bug:** App crashed during build because `CursorFollower.jsx` incorrectly duplicated `useState` calls and violated the Rules of Hooks by placing an early return before the hooks.
**Root Cause:** A bad merge left duplicate hook definitions in place, and placed `if (isTouchDevice) return null;` at the top of the component body, preventing hooks from executing on touch devices.
**Learning:** Always ensure all React hooks (`useState`, `useEffect`) execute in the same order on every render. Use conditional logic *inside* the `useEffect` body or place early UI returns just before the component return statement, never before the hooks.
