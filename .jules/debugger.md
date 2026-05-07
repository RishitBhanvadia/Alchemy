## 2024-05-07 - Fix duplicate state declaration in CursorFollower
**Bug:** Build failure due to duplicate state declarations.
**Root Cause:** The `clicking` and `hovering` states were declared twice in `client/src/components/CursorFollower.jsx`, causing esbuild to fail.
**Learning:** Always check for variable re-declarations when components return conditionally early on.
