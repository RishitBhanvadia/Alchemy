## 2024-03-17 - Avoid state for high-frequency cursor coordinates
**Learning:** Tracking cursor coordinates with `useState` in React for custom cursors causes excessive re-renders on every `mousemove` event, bottlenecking UI performance.
**Action:** Use `useRef` to maintain references to cursor DOM elements and directly mutate their `transform` property (for GPU acceleration) or `style.left`/`style.top` properties to bypass the React render cycle entirely for coordinate updates.
