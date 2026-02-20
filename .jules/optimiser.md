## 2025-02-21 - Unused Heavy 3D Context on Lab Page
**Bottleneck:** The `Lab` page was importing `CanvasContainer` (856kB) just to render invisible lights, causing a massive unnecessary download for users visiting the lab directly.
**Impact:** Removed ~850kB from the initial load of the `Lab` route.
**Learning:** Always verify if heavy components (like Three.js wrappers) are actually rendering visible content. In this case, a previous feature removal (`ReactiveBeaker`) left behind the heavy scaffolding (`CanvasContainer` + lights).
