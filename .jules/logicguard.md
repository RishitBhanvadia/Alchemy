## 2026-05-29 - Fixed duplicated and broken reaction ID logic

**Bug:** Catalyst and Indicator threshold checks were swapped in the result calculation logic.
**Root Cause:** The logic for computing a reaction ID was duplicated in `server/controllers/resultController.js` and diverged from the source of truth in `server/utils/reactionHash.js`. The result controller accidentally swapped the values for indicator (+100 instead of +1000) and catalyst (+1000 instead of +100).
**Learning:** Never duplicate business rules; if a rule requires configuration (like a dynamic threshold for fuzzy matching), inject the dependency or pass it as an argument rather than copying and modifying the function.
