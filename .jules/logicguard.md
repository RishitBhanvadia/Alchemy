## 2024-05-23 - Frontend/Backend Threshold Mismatch
**Bug:** Frontend allowed initiating reactions with chemical concentrations < 10%, but backend ignores concentrations < 10%.
**Root Cause:** `onOrNot` used `> 0` while backend used `>= 10` (`PRESENCE_THRESHOLD`).
**Learning:** Ensure UI validation constraints match the backend business logic thresholds to prevent silent failures or confusing outputs.
