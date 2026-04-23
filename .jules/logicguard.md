## 2024-04-23 - Average Score Calculation Bug
**Bug:** The average score calculation for classrooms included null and undefined scores as 0, artificially lowering the average.
**Root Cause:** The calculation didn't filter out experiments without scores before dividing by the total number of experiments (`logs.length`).
**Learning:** Always check and filter out null/undefined values before performing arithmetic aggregations like averages, especially when the denominator depends on the array length.