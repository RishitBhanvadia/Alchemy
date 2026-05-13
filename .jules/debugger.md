## 2026-05-13 - Fix Build Error from Duplicate/Conditional Hooks
**Bug:** The `client/src/components/CursorFollower.jsx` had duplicate `useState` hooks after an early return (conditional), causing a build crash and violating React Hook rules.
**Root Cause:** The component was conditionally returning early for touch devices, followed by duplicate declarations of state variables.
**Learning:** Always ensure all hooks (`useState`, `useEffect`) are declared at the top level of a component, before any early returns to avoid breaking React hook rules.
