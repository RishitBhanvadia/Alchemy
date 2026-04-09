## 2024-04-07 - LogicGuard: Fix duplicated inconsistent logic in reaction calculation
**Bug:** The result controller was calculating wrong reaction IDs (e.g. 101 instead of 1001 for 50% Acid + 50% Indicator) because it used an inline implementation of `computeReactionId` which had different mappings for index arrays than the central `reactionHash.js` utility (`i` mapping to 100 instead of 1000). Also `classifyRegime` in the controller didn't consider indicator/catalyst dominances.
**Root Cause:** Duplicated business logic that diverged. A custom inline variation was written instead of reusing existing shared utils.
**Learning:** Always check for centralized business rules (`utils/reactionHash.js`, `utils/regimeClassifier.js`) before implementing calculations directly in controllers.
