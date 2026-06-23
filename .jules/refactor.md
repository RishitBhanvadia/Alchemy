## 2026-06-23 - Fix duplicate state and Rules of Hooks violation in CursorFollower
**Before:** Duplicate state declarations (`clicking`, `hovering`) causing parsing errors. Early return (`if (isTouchDevice) return null;`) executed before a `useEffect` hook, which violates React's Rules of Hooks.
**Issue:** ESLint parsed duplicate identifiers causing build failures. Early return before hooks causes inconsistent hook call orders depending on the device type.
**Learning:** Fixing basic parsing errors in React components is critical for build stability. Additionally, always ensure that all React hooks are called unconditionally at the top level of the component before any early returns to prevent runtime inconsistencies.
