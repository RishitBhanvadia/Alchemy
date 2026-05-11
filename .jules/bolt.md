## 2024-05-11 - Optimising MouseMove Re-renders
**Learning:** In React components tracking high-frequency events like `mousemove` for custom cursors, using `useState` triggers massive performance degradation due to full component re-renders on every pixel move.
**Action:** Use `useRef` to directly manipulate DOM node styles (e.g., `element.style.left`, `classList.add`) instead of relying on `useState` setters.
