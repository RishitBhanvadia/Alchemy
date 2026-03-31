## 2026-03-31 - Fix normalisation logic in resultController
**Bug:** The `normalise` function calculated percentages using Math.round, leading to a sum > 100 or introducing "ghost" components (assigning 1% to a 0% component) because the remaining difference was dumped into the final component.
**Root Cause:** Using Math.round on individual ratios does not guarantee the sum equals 100. Dumping the residual into a single variable without regard to its true original value breaks accuracy invariants.
**Learning:** Use the Largest Remainder Method (Hare quota) when converting floating point ratios into integer percentages to guarantee a precise sum of 100 without over/under-allocating.
