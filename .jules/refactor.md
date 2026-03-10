## 2026-03-10 - Extract Magic Numbers
**Before:** Mathematical adjustment values like 10, 100, and 1000 were heavily embedded in normalisation checks.
**Issue:** What the magic numbers actually represented was lost in the formulas, making it hard to follow.
**Learning:** Always assign intention to magic numbers in calculation logic using clearly named constant variables.