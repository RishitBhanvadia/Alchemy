## 2024-05-18 - Rules of Hooks Violation
**Bug:** The `CursorFollower` component was crashing or causing a React error: `Rendered fewer hooks than expected`.
**Root Cause:** An early return (`if (isTouchDevice) return null;`) was placed before a `useEffect` hook, which violates React's Rules of Hooks. Hooks must be called unconditionally and in the exact same order on every render.
**Learning:** Always ensure conditional early returns are placed *after* all hooks (`useState`, `useEffect`, etc.) in functional components. To conditionally execute logic inside a hook, place the condition *inside* the hook's callback.
