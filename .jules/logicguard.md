## 2026-04-22 - Incorrect Average Score Calculation
**Bug:** The average score on the Teacher Dashboard calculated incorrect values when some logs contained `null` scores.
**Root Cause:** The calculation counted logs with `null` or `undefined` scores in the length of the array without verifying validity, and coerced missing scores to `0` instead of filtering them out. This mathematically lowered the average score unfairly.
**Learning:** Always filter collections for valid inputs before executing reducing aggregation operations, especially arithmetic averages, as missing values should not penalize results as zeroes.
