## 2026-02-23 - Unused 3D Contexts
**Learning:** `CanvasContainer` usage in `Lab.jsx` with only lights forced the entire Three.js bundle to load for that route, despite no visible 3D objects being rendered. The memory stated it was removed, but it was still present.
**Action:** Always verify "removed" features in source code. Avoid importing `@react-three/fiber` components in routes where 3D is not strictly necessary.
