## 2024-05-09 - Improve logic clarity and maintainability in lab components
**Before:** Nested if-else statements with deep indentation (e.g., `change_tip` in `lab.jsx`) and unclear function names (`onOrNot`, `useHandlePlayClick` acting as a standard handler).
**Issue:** Poor readability, mixed abstraction levels, and non-standard naming (hooks should start with `use`, not standard handlers).
**Learning:** Extracting condition checks to small helpers and replacing nested if-else with early returns makes the logic significantly easier to read and maintain. Proper naming conventions (e.g., `hasEnoughChemicals` instead of `onOrNot`) improve intent clarity.
