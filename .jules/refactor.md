## 2026-06-07 - Consolidate Reaction ID Computation
**Before:** Duplicate `computeReactionId` logic existed in `server/controllers/resultController.js` and `server/utils/reactionHash.js` with different threshold values.
**Issue:** Violates DRY principle and makes maintenance error-prone when reaction positional logic changes.
**Learning:** Utilities in this codebase can adapt to different contexts (e.g. fuzzy matching vs exact matching) by exposing configurable thresholds as optional parameters, allowing single source of truth without sacrificing flexibility.
