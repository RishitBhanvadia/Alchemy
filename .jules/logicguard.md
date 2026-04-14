## 2024-05-24 - Fix normalisation hallucinating values for 0 inputs
**Bug:** The `normalise` function was hallucinating values for 0 inputs (specifically for the `nc` parameter) due to rounding differences in calculations.
**Root Cause:** When distributing rounding errors across percentage calculations, the remainder was being dumped into the last element (e.g. `100 - a - b - c`), artificially creating non-zero values from 0 inputs.
**Learning:** Always explicitly calculate normalizations by rounding each element individually and safely distributing any difference to the largest valid component to ensure precision without hallucination.
