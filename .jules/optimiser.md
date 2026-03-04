## 2024-02-28 - Lazy load heavy 3D components on Landing page

**Bottleneck:** The Landing page had a massive bundle size (> 800KB) due to eager loading of 3D components (`CanvasContainer`, `FloatingMolecule`) and their dependencies (`@react-three/fiber`, `@react-three/drei`, `three`). This slowed down the initial page load significantly.

**Impact:** Reduced initial bundle size and deferred loading of heavy 3D dependencies until they are needed, significantly improving the initial load time for the landing page.

**Learning:** Eager loading of heavy 3D rendering libraries like `three` and `@react-three` is a major performance bottleneck for initial loads. Wrapping specific 3D elements like `FloatingMolecule` and `CanvasContainer` with `React.lazy` and `Suspense` defers these expensive imports and splits the code, keeping the initial JavaScript payload smaller and faster.
