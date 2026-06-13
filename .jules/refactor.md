## 2026-06-13 - Remove duplicated reaction logic
**Before:** `resultController.js` defined its own `computeReactionId` and `classifyRegime` functions.
**Issue:** Duplicated logic causes inconsistencies, and the local `classifyRegime` missed catalyst/indicator conditions.
**Learning:** Canonical sources for reaction logic must be used to prevent misclassification and maintain a single source of truth.
