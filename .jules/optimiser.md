## 2024-05-04 - Memoize Event Handlers in 3D Views
**Bottleneck:** Complex 3D view `Lab3D.jsx` was re-creating multiple event handlers (`handlePlayClick`, etc.) and derived states (`onOrNot`) on every render, causing unnecessary re-renders of child components like modals and AI panels.
**Impact:** Reduced unnecessary re-renders, smoothing UI interactions without blocking the main thread during heavy 3D rendering.
**Learning:** In components mixing heavy 3D canvas rendering and complex React UI state, it is critical to memoize event handlers and derived states to prevent UI updates from stuttering the 3D context.
