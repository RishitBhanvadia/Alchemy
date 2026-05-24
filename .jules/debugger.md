
## 2026-05-24 - Reaction Threshold Desync
**Bug:** The frontend was initiating chemical reactions as long as chemical presence was `> 0`, while the backend required them to be `>= 10` (the `PRESENCE_THRESHOLD`). This led to users being able to submit reactions that silently failed or produced incorrect backend calculations because the chemicals didn't meet the minimum required presence threshold.
**Root Cause:** The frontend `onOrNot` function in `client/src/pages/Lab3D.jsx` was hardcoded to check `if (chem > 0)`, whereas the backend's `server/utils/reactionHash.js` enforced a strict `PRESENCE_THRESHOLD = 10`. This creates a desync between the UI validation and the core application logic.
**Learning:** Always ensure validation logic (like minimum required quantities or thresholds) is synced between the client and server. When fixing issues in a separated stack (React + Node), checking both the UI controls and backend logic files is critical to finding threshold desynchronizations.
