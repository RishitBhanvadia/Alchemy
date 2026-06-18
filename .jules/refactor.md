## 2025-06-18 - Refactor change_tip in lab.jsx
**Before:** Deeply nested if/else conditionals to pick a colour.
**Issue:** Deeply nested `if/else` statements make it hard to read and hard to scale when new chemicals are added.
**Learning:** Replaced the nesting with early returns, greatly reducing complexity.
