## 2026-05-30 - Inverted Indicator and Catalyst logic
**Bug:** The `computeReactionId` function in `resultController.js` incorrectly assigned the indicator (`i`) to the 100s place and the catalyst (`c`) to the 1000s place.
**Root Cause:** The logic was incorrectly written as `if (i >= THRESHOLD) id += 100; if (c >= THRESHOLD) id += 1000;`, which contradicts the expected ID mapping defined elsewhere (e.g., in `reactionHash.js` and expected test outcomes).
**Learning:** Always verify that variable assignments and positional values in generated hash/ID functions match their intended specifications across the codebase to avoid unexpected mismatches.
