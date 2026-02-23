## 2024-05-22 - Rounding Adjustment & Normalization Logic
**Bug:** Concentrations summing to > 100 were not normalized, leading to invalid queries (sum ~190). Also, rounding adjustments only corrected small deviations (max 10%), failing for larger rounding errors.
**Root Cause:** The normalization logic had an explicit check `if (sum < 100)`, skipping the `sum > 100` case. The adjustment logic used a single `if` block instead of a loop.
**Learning:** Always normalize inputs to the target range (0-100) regardless of the initial sum unless explicitly invalid. Use iterative loops (`while`) for rounding adjustments to guarantee convergence to the exact target sum (100).
