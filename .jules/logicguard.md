## 2024-05-31 - Incorrect Reaction ID Calculation Logic
**Bug:** The catalyst logic threshold computation assigned 1000 instead of 100 to the ID, and the indicator logic threshold computation assigned 100 instead of 1000.
**Root Cause:** The `computeReactionId` method in `server/controllers/resultController.js` had the `c` (catalyst) and `i` (indicator) multipliers inverted (`c` added 1000, `i` added 100). The correct weights according to `server/utils/reactionHash.js` are `c`=100 and `i`=1000.
**Learning:** Duplicate utility logic across files can easily fall out of sync. It is vital to test expected output matches the definitive algorithms in utilities. We should consider removing duplicate utilities and importing standard implementations instead.
