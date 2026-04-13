## 2024-04-13 - Normalisation function hallucinates data
**Bug:** The `normalise` function in `resultController.js` artificially creates non-zero concentrations from 0 inputs because it assigns the rounding remainder directly to the last element (`nc`).
**Root Cause:** The logic `const nc = 100 - na - nb - ni;` ignores the actual original proportion of `nc`. If `na`, `nb`, and `ni` round down slightly, `nc` absorbs the difference to ensure the sum is exactly 100, even if its original input was exactly 0.
**Learning:** When normalising values to sum to 100, do not assign the remainder to a fixed element. Instead, calculate the fractional parts, round all elements individually, and distribute the difference to the largest value to preserve zero values.
