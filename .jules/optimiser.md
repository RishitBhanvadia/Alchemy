## 2025-06-07 - Optimize CursorFollower high-frequency state updates
**Bottleneck:** The `onMouseMove` event listener in `CursorFollower.jsx` was triggering synchronous React state updates on every pixel movement, leading to severe main thread blocking and layout thrashing.
**Impact:** Significantly reduced main thread blocking during mouse movement, eliminating jank and improving overall application frame rates by preventing rapid, unbatched re-renders.
**Learning:** High-frequency DOM event listeners (like `mousemove` or `scroll`) in React components must wrap state updates inside a `requestAnimationFrame` callback to throttle updates and align with browser rendering cycles.
