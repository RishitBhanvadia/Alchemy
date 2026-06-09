## 2026-06-09 - Fix Incorrect Reaction ID Positional Weights
**Bug:** The duplicated `computeReactionId` in `resultController.js` swapped the positional weights for indicator (100) and catalyst (1000) compared to the canonical utility.
**Root Cause:** A local copy of the hashing logic diverged from the canonical source in `reactionHash.js`.
**Learning:** Never duplicate business logic (like ID calculation hashes). Always use the single source of truth to avoid silent divergence.
