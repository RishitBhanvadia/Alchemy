## 2025-02-18 - Global Cursor Performance
**Bottleneck:** The `CursorFollower` component was re-rendering on every `mousemove` event due to `useState` usage for position tracking.
**Impact:** 100+ re-renders per second during mouse movement -> Reduced to ~0 re-renders (only on interaction state change).
**Learning:** For high-frequency global UI updates like custom cursors, bypassing React state in favor of `useRef` and direct DOM manipulation (via `requestAnimationFrame`) is essential to prevent main thread blocking and battery drain.
