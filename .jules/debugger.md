## 2025-05-26 - Frontend/Backend Validation Desync
**Bug:** The frontend UI allowed starting an experiment if two chemicals were greater than 0% (e.g. 1%), but the backend required them to be >= 10% to be considered present.
**Root Cause:** The `onOrNot` function in `client/src/pages/Lab3D.jsx` checked if the concentration was strictly greater than 0, while the backend's `PRESENCE_THRESHOLD` was 10.
**Learning:** Always check that the frontend's local state validation matches the backend's configuration constants or thresholds to prevent confusing user states.