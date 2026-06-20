## 2026-06-20 - Fix normalisation of chemical concentrations

**Bug:** `chem_c` was incorrectly being assigned a residual concentration value during normalisation even when it was passed as `0`.
**Root Cause:** The normalisation logic naively computed `nc = 100 - na - nb - ni`. Because `na`, `nb`, and `ni` were being rounded down using `Math.round()`, the rounding error was automatically assigned to `nc`, turning a `0%` concentration for `chem_c` into `1%` or more.
**Learning:** When normalising values to sum to a constant (like 100%), do not arbitrarily dump rounding errors onto a specific variable, especially one that could be zero. Instead, compute percentages uniformly and distribute the difference to the largest non-zero component to preserve the existence (or non-existence) of inputs.
