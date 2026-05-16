## 2025-02-14 - Direct DOM Mutation for High-Frequency React Events
**Learning:** In React components tracking high-frequency events (like `mousemove` for custom cursors), relying on `useState` setters triggers full component re-renders on every pixel move, leading to severe performance degradation.
**Action:** Use `useRef` to maintain references to DOM nodes and directly manipulate their styles (e.g., `element.style.left`) instead of triggering React state updates.
