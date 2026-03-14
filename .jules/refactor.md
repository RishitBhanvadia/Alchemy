## 2026-03-14 - Consolidate Multiple Array Iterations
**Before:** Data was iterated multiple times using `.reduce`, `.map`, and `.filter` to calculate user stats and badge criteria in `Profile.jsx`.
**Issue:** Iterating over an array multiple times degrades performance, especially as the number of user experiments increases. It scales poorly and makes the logic harder to follow because it separates related calculations.
**Learning:** Combining multiple array operations into a single O(N) loop improves performance and readability. Specifically, using separate `if` conditions inside the loop allows simultaneous accumulation of distinct metrics (like calculating scores, highest scores, and categorical counts simultaneously) without repetitive mapping and filtering.
