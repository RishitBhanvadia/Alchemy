## 2025-02-23 - Cursor Follower Re-render Fix
**Bottleneck:** Calling `setState` (e.g., `setPosition`) directly inside a `mousemove` event listener caused the component to re-render for every pixel the cursor moved, leading to severe performance degradation.
**Impact:** Eliminates constant re-renders during mouse movement, dramatically reducing CPU usage and improving frame rate across the entire application.
**Learning:** In React applications, avoid attaching `useState` hooks directly to high-frequency event listeners like `mousemove` or `scroll`. Instead, use `useRef` and direct DOM manipulation (`ref.current.style.left`) to update positional values and completely bypass the React render cycle.
