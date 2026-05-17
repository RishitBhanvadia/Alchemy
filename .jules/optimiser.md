## 2024-05-15 - Refactor CursorFollower to use refs
**Bottleneck:** CursorFollower component used `useState` for cursor position, triggering a full component re-render on every `mousemove` event, leading to severe performance degradation.
**Impact:** Eliminates all component re-renders on mouse movement, making cursor tracking virtually cost-free and significantly improving runtime performance and UI responsiveness.
**Learning:** For high-frequency events tracking (like custom cursors), always use `useRef` to directly manipulate DOM node styles instead of `useState` to avoid unnecessary React reconciliation cycles.
