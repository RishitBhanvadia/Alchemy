## 2026-05-01 - Score calculation ignores case for 'No Reaction'
**Bug:** `calculateScore` in `client/api/results.js` incorrectly awards points for 'No Reaction' because the equality check is strictly case-sensitive against 'No reaction' and 'Unknown Reaction', while the migrate script and other logic produce 'No Reaction'.
**Root Cause:** The `hasOutcome` logic uses `outcomeLabel !== 'No reaction'` without lowercasing, leading to true (awarding 40 points) when the database returns 'No Reaction'.
**Learning:** Always normalize case when checking strings for specific labels or enum-like values (e.g. `outcomeLabel.toLowerCase() !== 'no reaction'`).
