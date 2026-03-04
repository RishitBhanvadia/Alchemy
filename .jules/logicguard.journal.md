## 2024-05-24 - Fix Chemistry Result Calculation Logic Errors
**Bug:** The chemical concentration result calculation (`calculateResult` in `resultController.js`) had multiple connected logic errors:
1. When all inputs were 0, division by zero occurred resulting in `NaN` concentrations.
2. The logic normalized sums `< 100` but completely ignored normalization for sums `> 100`.
3. Rounding errors were adjusted using a single `if` block (adjusting by 10 max), leaving final sums completely incorrect when rounding deviated by more than 10 (e.g. four 25% concentrations rounding to four 30% concentrations = 120%).

**Root Cause:** The calculation didn't check for zero sums, skipped `> 100` normalization entirely, and failed to account for multi-variable rounding deviations.

**Learning:** When applying business logic that dictates variables must sum to exactly a target (like 100%), rounding adjustments must be handled iteratively (e.g., using a `while` loop) instead of conditionally (`if`). Edge case bounds (like division by zero when the sum is 0) must be safeguarded.
