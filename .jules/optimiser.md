## 2024-03-27 - Direct DOM Mutation for High-Frequency Events
**Bottleneck:** The custom `CursorFollower` component used `useState` for mouse position, causing continuous React re-renders on every `mousemove` event.
**Impact:** Eliminated hundreds of synchronous re-renders per second, significantly freeing up the main thread and reducing frame drops.
**Learning:** For high-frequency event listeners (like `mousemove` for custom cursors), use `useRef` to reference DOM elements and directly mutate their style properties (e.g., `ref.current.style.left`) instead of `useState` to avoid severe performance degradation from constant synchronous re-renders.
