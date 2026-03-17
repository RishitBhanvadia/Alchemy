## 2025-03-17 - Extracted duplicated validateConcentration
**Before:** Two identical implementations of `validateConcentration` existed in both `server/controllers/aiController.js` and `server/controllers/resultController.js`.
**Issue:** The validation logic was duplicated across multiple controllers, increasing maintenance overhead and the risk of inconsistencies.
**Learning:** Extracting common validation logic into a shared utility file (`server/utils/validateConcentration.js`) reduces duplication and centralizes the logic, making future updates easier and safer. Using a slightly more defensive implementation that handles `undefined` and `null` safely accommodates the needs of multiple call sites without changing behavior.
