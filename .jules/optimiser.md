## 2024-03-11 - Lazy Loading 3D Components
**Bottleneck:** The 3D scene (CanvasContainer) loaded `@react-three/fiber` synchronously, blocking the initial load.
**Impact:** Significantly reduced the main JavaScript bundle size by lazily loading a new intermediate `Scene` component instead of `CanvasContainer` directly. This speeds up the initial page load time.
**Learning:** When lazy-loading heavy 3D components (`@react-three/fiber`) in the Alchemistry frontend, avoid lazy-loading 3D children inside a statically imported `<Canvas>` due to React/R3F reconciler incompatibilities. Instead, encapsulate the entire 3D scene (including the `<Canvas>` or `CanvasContainer`) into a single wrapper component and asynchronously import that wrapper using `React.lazy()` and `<Suspense>`.
