2026-05-31 - Fix inverted weights for reaction_id computation
**Bug:** The `reaction_id` computed in `server/controllers/resultController.js` was calculating incorrectly because the weights for indicator and catalyst were inverted.
**Root Cause:** In `computeReactionId`, the catalyst (`c`) was given a weight of 1000 and the indicator (`i`) a weight of 100. This didn't match the source of truth in `server/utils/reactionHash.js` which has catalyst = 100 and indicator = 1000. This meant calculations for any reactions involving these chemicals generated the wrong IDs and failed to hit the database correctly.
**Learning:** Always double-check weights or magic numbers when reimplementing logic that acts as a lookup key for databases, ensuring it matches the core utility/source of truth.
