## 2026-02-24 - Unused 3D Bundle in Lab Page
**Bottleneck:** The `Lab` page was unnecessarily importing `CanvasContainer` (and thus the entire Three.js library ~856KB) to render an empty 3D scene with only lights.
**Impact:** Removed ~856KB (231KB gzipped) of JS from the critical path for the Lab route.
**Learning:** Always audit components for unused imports, especially heavy libraries like Three.js. Even if a component renders "nothing visible", its dependencies are still bundled if imported.
