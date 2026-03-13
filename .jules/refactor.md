## 2026-03-13 - O(N) Array iteration reduction in Profile.jsx
**Before:** Data processing used multiple chained array methods (`reduce`, `map`, `filter` × 2) sequentially to calculate totals, max score, and specific counts.
**Issue:** This caused multiple full iterations over the same experiment data array, which impacts performance as the array size grows.
**Learning:** Consolidating iterative calculations (summing scores, tracking max values, and tallying categories) into a single explicit `for` loop provides a clear O(N) pass, significantly reducing redundant processing while calculating dashboard metrics.
