## 2024-05-24 - Profile Average Score Calculation Ignores 0s
**Bug:** The student's average accuracy calculation on their profile ignored scores of `0` because of a `.filter(s => s > 0)` condition, artificially inflating the average score and hiding failed experiments.
**Root Cause:** The logic assumed that `0` meant an invalid or missing score, but `0` is a valid outcome of an experiment attempt.
**Learning:** Always verify whether `0` is a valid business value before using `|| 0` combined with filtering. Failing attempts should be factored into aggregate averages.
