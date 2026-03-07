## 2024-05-24 - Fix NaN propagation on zero concentration inputs in result calculation

**Bug:** Division by zero (`NaN`) occurred and broke subsequent calculations when all chemical inputs were zero. Rounding error logic was also only conditionally executing once and allowed nearest-10 roundings to not properly total 100%.

**Root Cause:** Normalization condition missed checking if the sum of all inputs equals zero. `Math.max` and `Math.min` adjustments only corrected 10 units rather than iteratively ensuring the sum reaches 100 via a loop.

**Learning:** When calculating totals or percentages, edge cases such as zero (or arrays of zeros) must be guarded against to avoid `NaN` propagation into data tables. Ensure adjustment code logic is encapsulated in `while` loops if its single goal is to meet a specific sum constraint.
