## 2024-05-11 - Add missing security fix

**Vulnerability:** Code review rejected the previous patch because I accidentally reverted the actual security fix for `Math.random` when dealing with the git state before applying CI fixes.
**Fixes:**
1. Re-apply the `crypto.randomInt` fix in `server/controllers/meetingController.js` and `server/controllers/classroomController.js`.
2. Re-apply the `window.crypto.getRandomValues` fix in `client/src/store/classroomStore.js`.
