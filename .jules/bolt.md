## 2024-05-23 - Unused Three.js Initialization
**Learning:** The `Lab` component was initializing a full Three.js context via `CanvasContainer` (using `@react-three/fiber`) but rendering no visible 3D objects (only lights). This caused unnecessary overhead for a critical page.
**Action:** Always check if heavy libraries like Three.js are actually rendering content before keeping them in the render tree. Use conditional rendering or remove if unused.

## 2024-05-23 - Missing Page Tests
**Learning:** `Lab.jsx` had no unit tests, making refactoring risky.
**Action:** Created a baseline test `Lab.test.jsx` before optimizing. Always ensure a test exists before modifying code without existing coverage.
