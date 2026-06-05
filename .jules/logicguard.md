## 2024-06-05 - Canonical Weight Mismatch in Result Calculation
**Bug:** The `calculateResult` function in `server/controllers/resultController.js` computed the `reaction_id` incorrectly because the indicator and catalyst weights were swapped (`i` was 100 instead of 1000, `c` was 1000 instead of 100).
**Root Cause:** The `computeReactionId` function in the controller diverged from the canonical weight definitions established in `server/utils/reactionHash.js`.
**Learning:** Canonical business logic (like positional hash weights) should not be duplicated across modules. When duplicating is necessary, strict adherence to the canonical source is required to prevent incorrect algorithmic results.
