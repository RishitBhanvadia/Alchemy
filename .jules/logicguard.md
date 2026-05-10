## 2026-05-10 - Normalization Logic Creating Matter

**Bug:** The `normalise(a, b, i, c)` function in `server/controllers/resultController.js` calculated `nc = 100 - na - nb - ni` to ensure concentrations summed to exactly 100. However, this caused `nc` to receive any rounding discrepancies (e.g., `1, 1, 1, 0` -> `33, 33, 33, 1`) even when `c` was 0, effectively creating chemical C out of nothing.

**Root Cause:** Subtracting rounded totals from 100 on the *last* element unconditionally forces the last element to absorb all floating-point rounding errors without regard for its original proportion.

**Learning:** When normalizing percentages that must sum to exactly 100, calculate each rounded percentage independently. Then, distribute any remainder (`100 - sum`) to the *largest* value to minimize relative error, rather than blindly dumping it onto the last parameter which might have been zero.
