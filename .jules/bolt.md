## 2024-03-24 - React High-Frequency Event Tracking
**Learning:** Using `useState` to track high-frequency events like `mousemove` for custom cursors causes severe performance degradation due to constant component re-renders.
**Action:** Use `useRef` and direct DOM mutation (e.g., `ref.current.style.left`) instead of `useState` for performance-critical DOM nodes in these cases.
