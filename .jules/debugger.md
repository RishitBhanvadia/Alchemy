## 2024-05-24 - Result Calculation Logic Fixes
**Bug:** Division by Zero and Rounding Inaccuracy in Chemical Concentrations
**Root Cause:**
1.  **Division by Zero:** The normalization logic did not check if the sum of inputs was 0 before dividing, leading to `NaN` results.
2.  **Rounding Inaccuracy:** The rounding adjustment logic only performed a single pass correction (+/- 10). In cases where multiple values rounded up (e.g., four values ending in `.5`), the sum could overshoot by 20, which a single -10 correction could not fix, resulting in a sum of 110 instead of 100.
**Learning:**
1.  **Iterative Adjustment:** When enforcing a strict sum constraint on rounded integers, use a `while` loop to iteratively adjust the largest/smallest values until the target sum is reached. Do not assume a single adjustment is sufficient.
2.  **Zero Handling:** Always explicitly handle the "0 sum" case before normalization logic that involves division.
