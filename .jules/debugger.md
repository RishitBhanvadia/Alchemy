## 2024-05-07 - Fix duplicate state declaration in CursorFollower
**Bug:** Build failure due to duplicate state declarations. Server verification in CI times out.
**Root Cause:** The `clicking` and `hovering` states were declared twice in `client/src/components/CursorFollower.jsx`, causing esbuild to fail. The server check timed out because the script had no exit condition for a successfully started express server.
**Learning:** Always check for variable re-declarations when components return conditionally early on. Add timeouts to CI scripts that start servers using `app.listen()`.
