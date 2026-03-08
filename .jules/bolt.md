## 2024-05-18 - Lazy-loading React-Three-Fiber Components
**Learning:** React and React-Three-Fiber reconcilers can have incompatibilities when lazy-loading 3D children directly inside a statically imported `<Canvas>`.
**Action:** Instead of lazy-loading individual 3D elements inside `<Canvas>`, encapsulate the entire 3D scene (including `<Canvas>` or `CanvasContainer`) into a single wrapper component. Then, asynchronously import that wrapper using `React.lazy()` and `<Suspense>`.
