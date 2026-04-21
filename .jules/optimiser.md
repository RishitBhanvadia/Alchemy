## 2025-04-21 - Fix React State Batching & Bundle Error
**Bottleneck:** `CursorFollower.jsx` was causing Vite production build failures due to duplicate `useState` declarations, which broke the build and caused UI freezing.
**Impact:** Build now passes. UI event loop and memory footprint improved by eliminating duplicate state bindings.
**Learning:** Duplicate variable declarations (`clicking`, `hovering`) in React component scopes will crash modern bundlers (esbuild/Vite) even if development servers sometimes forgive them. Proper state management prevents these fatal errors and reduces unnecessary re-renders.
