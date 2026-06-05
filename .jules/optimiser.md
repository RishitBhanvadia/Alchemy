## 2026-06-05 - Optimize App Performance
**Bottleneck:** Duplicate variables in `CursorFollower` causing build failure. Also there are unused/heavy static assets (`labgif.gif`, `labgigbl.gif`) making the bundle very large and blocking the initial load.
**Impact:** Eliminates build error. Removing the unused `labgif.gif` reduces the bundle size significantly.
**Learning:** Found an unused, heavy 1.6MB `labgif.gif` that wasn't correctly referenced anywhere in the app, but failing the build when another file requested the similar name (`labgigbl.gif`). Also fixed syntax error in `CursorFollower` which was directly impacting build output. Removing unnecessary files from version control and bundle saves a massive amount of payload size for users.
