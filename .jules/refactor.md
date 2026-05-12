## 2026-05-12 - Refactoring onOrNot and forEach
**Before:** Imperative counting logic in `onOrNot` and side-effect mutation inside `forEach`. Also, duplicate hooks and early returns breaking React hook rules in `CursorFollower.jsx`.
**Issue:** Poor readability, naming convention, violation of React hook rules, and reliance on mutable variables instead of declarative array methods.
**Learning:** Using array `filter` and `reduce` provides declarative, readable alternatives. Hook order is critical to avoid conditional hook call errors. Re-evaluating variable states before mutation ensures safer refactoring.
