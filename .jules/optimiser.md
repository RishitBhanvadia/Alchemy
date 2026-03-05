## 2026-03-05 - Lazy Load Heavy 3D Libraries
**Bottleneck:** `@react-three/fiber` and `@react-three/drei` along with 3D models were being included in the main bundle, causing massive initial JavaScript payload sizes and blocking rendering.
**Impact:** Significantly reduced the main initial load size by splitting massive 3D modules into separate chunks.
**Learning:** To prevent massive initial JS payloads, heavy 3D rendering libraries and components (like `@react-three/fiber`, `@react-three/drei`, `CanvasContainer`, and `FloatingMolecule`) must be lazy-loaded using `React.lazy` and `Suspense` rather than imported eagerly in route components.
