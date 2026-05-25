## 2026-05-25 - Fix incorrect reaction ID computation in resultController
**Bug:** The API was failing to correctly look up reactions due to a wrongly computed `reaction_id`.
**Root Cause:** The `resultController.js` had a duplicated, buggy version of the `computeReactionId` function. It used a threshold of 5% instead of 10% and incorrectly swapped the multiplier weights for catalyst and indicator.
**Learning:** Avoid code duplication for core logic. Ensure business rules (like computing identifiers based on specific logic) reside in a single canonical file (e.g., `server/utils/reactionHash.js`) to prevent drift and incorrect behaviour.
