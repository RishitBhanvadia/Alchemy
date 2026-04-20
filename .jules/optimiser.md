## 2025-04-20 - Avoid React Renders on High-Frequency Events
**Bottleneck:** High-frequency events like `mousemove` triggering full React component re-renders through `useState`.
**Impact:** Prevents the main thread from getting blocked by continuous re-renders. Allows smoother UI interactions especially on elements that follow the cursor.
**Learning:** Using `useRef` directly to manipulate DOM element styling bypasses the React render cycle and is highly preferable for continuous/high-frequency events where re-render overhead impacts performance.
