## 2025-02-12 - Fix duplicated states and early return before hooks
**Bug:** Build failed due to duplicate declaration of state variables and early return before `useEffect` violating hooks rules.
**Root Cause:** The state variables `clicking` and `hovering` were declared twice. Additionally, an early return (`if (isTouchDevice) return null;`) was placed before the `useEffect` hook.
**Learning:** Always ensure state declarations are unique and early returns that conditionally bypass hooks are moved below all hook declarations to respect React's Rules of Hooks.