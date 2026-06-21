## 2024-05-18 - Fix CursorFollower duplicate variables and Hooks rule
**Bug:** Build failed because of duplicate variable declarations (`clicking`, `hovering`) in `CursorFollower.jsx`.
**Root Cause:** A merge conflict or copy-paste error caused the state variables to be declared twice, sandwiching an early return `if (isTouchDevice) return null;` which also violated the Rules of Hooks by conditionally bypassing the subsequent `useEffect` and duplicate `useState` hooks.
**Learning:** Always ensure hooks are called unconditionally at the top level. Instead of an early return that prevents hook execution, conditionally render the JSX output at the end of the component.
