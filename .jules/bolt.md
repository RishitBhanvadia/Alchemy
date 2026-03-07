## 2024-03-07 - Heavy 3D Components Blocking Main Thread
**Bottleneck:** In the Alchemistry frontend, heavy 3D rendering components utilizing `@react-three/fiber` and `@react-three/drei` (like `CanvasContainer` or `FloatingMolecule`) block the main thread and create massive initial bundle chunks if imported synchronously.
**Impact:** Slows down initial page load and application responsiveness.
**Learning:** These heavy components must be asynchronously imported using `React.lazy()` and wrapped in `<Suspense fallback={null}>` to prevent massive initial bundle chunks and main thread blocking.
