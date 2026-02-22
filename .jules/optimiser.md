## 2025-05-23 - Removed Unused WebGL Context from Lab Page
**Bottleneck:** The `Lab` component was rendering an empty `CanvasContainer` which initialized a full Three.js WebGL context, causing a massive 850KB+ bundle dependency and runtime overhead.
**Impact:** ~850KB (uncompressed) / ~230KB (gzipped) reduction in initial load for the `/lab` route. Eliminated WebGL context creation cost.
**Learning:** Always audit heavy visualization libraries (like Three.js) to ensure they are actually rendering content. Empty wrappers can still pull in the entire library.
