## 2024-03-09 - Lazy Load 3D Assets
**Learning:** Statically importing heavy 3D assets (`@react-three/fiber` `<Canvas>`) inside lazy-loaded page components blocks the main thread during navigation and can cause React/R3F reconciler incompatibilities.
**Action:** Encapsulate the entire 3D scene (including `<Canvas>`) in a separate wrapper component and asynchronously import that wrapper using `React.lazy()` and `<Suspense>` within the route component to improve critical render path performance.
