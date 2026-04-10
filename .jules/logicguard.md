## 2024-05-18 - Logic Error in Result Controller
**Bug:** The `resultController` is duplicating `computeReactionId` and `classifyRegime` functions inline. It uses the wrong multipliers for `i` and `c` compared to `reactionHash.js` and uses a different logic for `classifyRegime`.
**Root Cause:** The business logic was duplicated and diverged from the source of truth in `server/utils`.
**Learning:** Always import centralized utility functions from `server/utils/` to prevent logic drift and inconsistent variable mappings.
