LOGICGUARD'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-05-24 - Result Calculation Convergence Failure
**Bug:** The chemical result calculation logic failed to ensure that the sum of concentrations equals exactly 100% when rounding errors accumulate beyond a single 10% step. Inputs like 23, 23, 23, 23 resulted in a sum of 110% because the code only corrected the sum once.
**Root Cause:** The adjustment logic assumed that the deviation from 100 would always be exactly ±10. It did not account for cases where multiple components round up/down, creating a larger deviation (e.g., ±20).
**Learning:** When normalizing data that must sum to a fixed total (like 100%), do not assume the error magnitude is bounded by a single step. Use an iterative convergence loop with a safety break to ensure the invariant holds. Also, adjusting the largest components minimizes relative error compared to adjusting the smallest.
