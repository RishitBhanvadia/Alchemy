## 2026-06-06 - Fix Reaction ID Weights
**Bug:** The `computeReactionId` function in `server/controllers/resultController.js` incorrectly assigned the weight of 100 to indicator (`i`) and 1000 to catalyst (`c`).
**Root Cause:** The `computeReactionId` utility logic was duplicated and the positions of `i` and `c` were swapped compared to the canonical source in `server/utils/reactionHash.js`.
**Learning:** Canonical utility functions like `computeReactionId` should not be duplicated across controllers. If they must be, we must enforce the same logical weights across all versions.
