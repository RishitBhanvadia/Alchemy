## 2024-03-14 - Mocking React Three Fiber for UI Tests
**Gap:** Testing components with 3D canvas rendering dependencies like Lab3D.jsx.
**Learning:** Rendering `<Canvas>` directly in jsdom environments fails because WebGL contexts are missing, causing test crashes or silent hangs.
**Pattern:** Mock `@react-three/fiber` to replace `<Canvas>` with a simple container `<div data-testid="mock-canvas">{children}</div>` to safely verify the surrounding UI elements and controls.