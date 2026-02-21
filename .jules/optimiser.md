## 2025-02-12 - Removed Unused CanvasContainer from Lab Page
**Bottleneck:** The `Lab` page was unnecessarily loading and initializing a heavy Three.js `CanvasContainer` (~856kB) that rendered no visible content.
**Impact:** Reduced `Lab` page JS payload by ~856kB (97% reduction in specific code) and eliminated WebGL context creation/animation overhead.
**Learning:** Always verify if heavy 3D components actually render visible content. Removing unused 3D contexts yields massive wins in both bundle size and runtime performance.
