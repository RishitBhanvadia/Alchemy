## 2024-05-19 - Eliminate synchronous re-renders for custom cursor
**Bottleneck:** The `CursorFollower` component triggered a React state update and a synchronous re-render on every `mousemove` event, causing main-thread stuttering.
**Impact:** Eliminating these re-renders yields a much smoother 60FPS UI interaction across the application, saving substantial CPU cycles during high-frequency mouse movements.
**Learning:** For continuous high-frequency events (like custom cursors or scroll tracking), bypass React's render lifecycle entirely. Use `useRef` to directly mutate DOM node styles, and specifically use `transform: translate3d(...)` instead of `left`/`top` to avoid costly browser layout recalculations.
