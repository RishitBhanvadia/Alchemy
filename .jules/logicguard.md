## 2025-05-23 - Chemical Result Calculation Logic Errors
**Bug:** The `calculateResult` function failed for zero-sum inputs (division by zero -> NaN) and for inputs where rounding errors accumulated beyond a single correction step (sum != 100).
**Root Cause:**
1. Normalization logic `chem / sum * 100` did not check if `sum > 0`.
2. Rounding adjustment logic used a single `if` block instead of a loop, failing when total error exceeded the adjustment step size (10).
3. "Sum > 100" adjustment reduced the *minimum* value, risking zeroing out small components and distorting ratios.
**Learning:** Always validate denominators before division. When enforcing a constraint (sum=100) on discrete values (multiples of 10), use an iterative approach (while loop) with a safety break rather than a single conditional adjustment. Prefer adjusting large values to minimize relative error.
