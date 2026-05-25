## 2024-05-25 - Duplicated and Incorrect computeReactionId Logic
**Bug:** The `computeReactionId` function in `server/controllers/resultController.js` was a duplicated version that used an incorrect threshold of 5% (instead of the correct 10%) and swapped the mappings for catalyst and indicator IDs compared to the canonical implementation.
**Root Cause:** The `computeReactionId` function was duplicated locally within the controller file rather than importing the established standard utility from `server/utils/reactionHash.js`.
**Learning:** Always enforce the DRY (Don't Repeat Yourself) principle for core domain logic like reaction ID generation. Duplication almost inevitably leads to divergence and hidden bugs. Centralized utilities should be imported instead of redeclared.
