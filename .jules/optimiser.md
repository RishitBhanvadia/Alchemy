## 2025-03-08 - Lazy Loading Heavy 3D Fiber Components
**Bottleneck:** Statically importing `@react-three/fiber` components inside `CanvasContainer` blocked initial app rendering and created massive entry chunks (18.14 kB and 23.42 kB for Landing and Lab, respectively).
**Impact:** Using `React.lazy()` and `<Suspense>` to asynchronously import encapsulated wrapper components (`LandingScene` and `LabScene`) dramatically reduced initial chunks to ~0.91 kB and ~0.23 kB.
**Learning:** Encapsulate the entire 3D scene (including `<Canvas>` or `CanvasContainer`) into a wrapper component and dynamically import it to avoid React reconciler issues with R3F children while drastically shrinking the critical JS bundle.
