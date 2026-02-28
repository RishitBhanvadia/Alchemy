## 2024-XX-XX - [Silent NaN and Invalid Normalization with 0 Sum]
**Bug:** When passing `0` for all chemical parameters (`chem_a=0`, `chem_b=0`, `chem_c=0`, `chem_d=0`), the sum is `0`. The code normalized `sum < 100` by dividing each parameter by `sum`, resulting in `0 / 0 = NaN`. This causes subsequent calculations to break and generates invalid values.
**Root Cause:** Missing a specific check for `add === 0` before doing normalization `(add < 100)`.
**Learning:** Always verify that the denominator is not zero when normalizing fractions/percentages, and add early returns for `0` state edge cases to prevent silent `NaN` calculations cascading through the logic.

## 2024-XX-XX - [Incomplete Rounding Adjustment Loop]
**Bug:** After normalization and rounding to the nearest 10, the code attempts to correct rounding errors to ensure the sum is exactly 100. However, the `if (final_add < 100)` or `if (final_add > 100)` logic was only adjusting *once* rather than iteratively (e.g., in a `while` loop) until the sum matches 100.
**Root Cause:** Using `if` instead of a `while` loop for correcting values that may be off by more than 10 (e.g., off by 20 if multiple values rounded down).
**Learning:** When adjusting values to meet an exact target sum, always use an iterative approach (`while`) to ensure the target is fully met when the error can be larger than the single adjustment step.
