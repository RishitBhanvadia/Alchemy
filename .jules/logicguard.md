## 2024-05-26 - Fix incorrect compute reaction ID generation in result controller
**Bug:** The result controller inverted the multiplier weights for indicator and catalyst.
**Root Cause:** The `computeReactionId` function inside the controller wrongly multiplied the indicator by 100 instead of 1000, and catalyst by 1000 instead of 100.
**Learning:** This could be caught earlier by creating shared constants for thresholds and multipliers.
