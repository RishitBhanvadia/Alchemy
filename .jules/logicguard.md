## 2024-05-24 - Incorrect filtering of zero scores in averages
**Bug:** The average score calculation filtered out values of 0, incorrectly removing failed experiments from the user's statistics.
**Root Cause:** The `filter(s => s > 0)` and `filter(s => s || 0)` checks inadvertently excluded literal zeroes, which are meaningful valid scores (failures).
**Learning:** In scoring systems, always differentiate between `null`/`undefined` (unscored) and `0` (scored but failed). Use `>= 0` instead of `> 0` for filtering numerical bounds.
