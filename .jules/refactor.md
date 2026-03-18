## 2024-05-18 - Extract duplicate validation logic
**Before:** Duplicate `validateConcentration` functions existed in both `resultController.js` and `aiController.js`, with the latter slightly different to handle empty values correctly for optional inputs.
**Issue:** Code duplication and logic fragmentation for chemical concentration validation.
**Learning:** Extracting into a shared `validation.js` utility and parameterized configuration (e.g. `allowEmpty`) helps ensure validation remains uniform across the API endpoints while supporting required variances.
