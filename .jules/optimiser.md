## 2024-05-24 - CanvasContainer Bundle Size
**Bottleneck:** `@react-three/fiber` and `@react-three/drei` components are being loaded synchronously in pages, causing large bundle chunks (856KB CanvasContainer chunk) and blocking the main thread.
**Impact:** Will reduce initial load bundle size and prevent layout blocking.
**Learning:** In the Alchemistry frontend, heavy 3D components should be encapsulated and imported asynchronously using `React.lazy()` and `<Suspense>`.
