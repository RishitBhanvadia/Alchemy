## 2026-06-08 - Fix reaction ID weights calculation
**Bug:** The result controller used a duplicated and incorrect reaction ID calculation logic where indicator and catalyst weights were swapped, resulting in incorrect reaction outcomes.
**Root Cause:** Duplicated logic in `resultController.js` diverged from the canonical `reactionHash.js` utility, assigning a weight of 100 to the indicator instead of 1000, and 1000 to the catalyst instead of 100.
**Learning:** Always use the canonical utility functions for domain logic (like `computeReactionId`) rather than duplicating them locally, as duplicated logic can easily drift and swap critical weights, causing silent logic errors in the application.
