## 2024-04-11 - Fixed Normalisation Logic
**Bug:** The result engine would assign a concentration to a chemical that wasn't added if the original total rounding generated a discrepancy from 100%.
**Root Cause:** The `normalise` function manually rounded the first 3 concentrations and rigidly dumped `100 - na - nb - ni` onto the 4th chemical, mutating zero values to positive non-zero concentrations.
**Learning:** For arrays expected to sum precisely to 100%, rounding differences should be re-distributed to the largest existing value, not a hardcoded index, to avoid inventing new data.
