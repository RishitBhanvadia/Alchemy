## 2026-04-12 - Fix normalization logic calculating incorrect chemical concentration

**Bug:** When normalizing chemical concentrations in `resultController.js`, rounding differences caused the array sum to sometimes deviate from 100%. The original code attempted to fix this by setting the 4th value (`nc`) as the remainder (`100 - na - nb - ni`). This created two critical logic bugs:
1. If the first three variables rounded down, `nc` would become artificially positive (e.g. `nc = 1`), even if the original input for `c` was `0`.
2. If the first three variables rounded up, `nc` would become negative (e.g., `-1`), which was then clamped to `0`, resulting in the sum of the array exceeding 100% (e.g. `101%`).

**Root Cause:** The remainder assignment assumed that only a positive remainder is possible without realizing it creates a completely artificial concentration when `c=0`. The normalization sum invariant wasn't properly re-balanced over the *highest* element that had enough weight, but blindly forced entirely onto the final element.

**Learning:** When enforcing an array sum invariant (like 100%), do not offload the entire floating-point rounding error onto a single fixed index unless guaranteed. Instead, distribute the rounding error (which is usually `+/- 1` or `2`) to the largest existing concentration (the "max" index) so relative balances stay stable and zero inputs stay zero.
