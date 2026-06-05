## 2024-06-05 - Fix hook rules and throttle high-frequency events in CursorFollower
**Before:** Early return before hooks, causing hook rule violations, and unthrottled mousemove events.
**Issue:** Breaks React hook constraints, causes ESLint errors, and triggers layout thrashing.
**Learning:** Moving conditional renders after all hooks resolves lint errors, and wrapping state updates in requestAnimationFrame in high-frequency listeners effectively prevents thrashing while preserving responsiveness.
