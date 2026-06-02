## 2024-05-24 - Inconsistent Positional Weights in Reaction ID Calculation
**Bug:** The computeReactionId function in server/controllers/resultController.js incorrectly assigned the positional weights for indicator (100) and catalyst (1000).
**Root Cause:** Duplicated logic from server/utils/reactionHash.js was modified or implemented incorrectly, swapping the weights for chem_c and chem_i.
**Learning:** Always ensure consistency across duplicated implementations of core logic, or better yet, avoid duplication by refactoring into a shared utility.
