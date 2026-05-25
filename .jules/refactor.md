## 2025-05-25 - Deduplicate computeReactionId in ResultController
**Before:** `server/controllers/resultController.js` had a local copy of the `computeReactionId` function with a lower presence threshold of 5% instead of importing the correct version with a 10% threshold.
**Issue:** Having duplicate implementations of core business logic introduces inconsistencies and logic errors. The controller's hash logic was broken compared to standard implementation.
**Learning:** Always extract core domain logic into a shared utility file (like `utils/reactionHash.js`) to maintain single source of truth across controllers.
