## 2024-05-22 - LogicGuard: Fix divide-by-zero logic error in chemical result calculation
**Bug:** When all inputs were 0, the backend logic crashed and sent `NaN` to the database, also incorrectly incrementing a 0 input to 10 due to rounding adjustments.
**Root Cause:** Normalization logic divided by `sum` without checking if `sum > 0`. Rounding adjustment assumed `sum` was close to 100 and forced an increment if `sum < 100`, even if `sum` was 0.
**Learning:** Always validate denominators before division. Edge cases like "all zero inputs" must be explicitly tested, especially in calculation logic that assumes "normal" operating ranges. Mocking frameworks that bypass actual logic (like `api.test.js` did) can hide critical bugs; unit tests should test the actual controller/service logic.
