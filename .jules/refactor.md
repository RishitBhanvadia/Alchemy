## 2026-06-06 - Deduplicate computeReactionId and Fix Weightings
**Before:** `server/controllers/resultController.js` had its own `computeReactionId` implementation with incorrect positional weightings for indicator and catalyst. The canonical version was in `server/utils/reactionHash.js`.
**Issue:** Code duplication and inconsistent core logic (weights 1, 10, 100, 1000 instead of matching canonical 1, 10, 100, 1000 correctly).
**Learning:** Utilities shared between logic handlers and data normalizers should be centralized. By making the `THRESHOLD` a parameterized argument with a default value, we can safely reuse the canonical utility across different contexts without introducing duplicate code or mismatching positional logic.
