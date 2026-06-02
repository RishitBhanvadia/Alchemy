## 2025-02-28 - Reaction Hash Weight Inversion
**Bug:** The `computeReactionId` function in `resultController.js` swapped the positional weights for catalyst and indicator, breaking result matching.
**Root Cause:** The catalyst `c` should have weight `100` and indicator `i` should have `1000` (as defined in `reactionHash.js`), but `resultController.js` incorrectly assigned `i` to `100` and `c` to `1000`.
**Learning:** When duplicating calculation logic with hardcoded weights, ensure positional parity across all instances, or better yet, extract the logic to a single shared function.
