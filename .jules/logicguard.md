## 2025-05-13 - Fix duplicate variables causing build failures
**Bug:** The `CursorFollower` component had duplicate `useState` definitions for `clicking` and `hovering`.
**Root Cause:** A bad merge or copy-paste error caused the hooks to be defined twice, before and after an early return. While development builds may have tolerated this depending on caching, production minification via esbuild throws an "identifier already declared" error.
**Learning:** Always verify `npm run build` passes before submitting even small visual changes. Duplicated variables can be surprisingly destructive during the minification and bundling phase in Vite.
