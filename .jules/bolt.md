## 2026-03-06 - Lazy Load 3D Components
**Learning:** Initial page loads were delayed due to heavy `@react-three/fiber` and `@react-three/drei` components being bundled in the main entry point chunks. In this architecture, it is essential to lazy load threejs/fiber based elements, like `CanvasContainer`, and `OrbitControls`, in route components.
**Action:** Use `React.lazy()` and `Suspense` for heavy 3D components, mapping named exports using a promise chain (`import().then(m => ({default: m.ExportName}))`). Do not change test configurations or css styles.
