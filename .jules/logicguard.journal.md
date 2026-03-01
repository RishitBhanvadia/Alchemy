## 2024-05-25 - Fix result calculation edge cases and rounding
**Bug:** Division by zero causes `NaN` output for all 0s. Iterative rounding adjustments used `if` instead of `while`, failing to normalize rounding errors correctly when difference > 10.
**Root Cause:** Missing guard for `add === 0`. Using `if` instead of `while` loop for adjustments, meaning values are not adjusted iteratively until the sum reaches 100.
**Learning:** Always guard against division by zero in normalisation. When adjusting for rounding errors dynamically, always use loops (`while`) to ensure the target condition is met, as single `if` statements only handle fixed-step deviations.
