## 2026-03-25 - React Component Re-renders on High-Frequency Events
**Learning:** High-frequency events like `mousemove` trigger excessive re-renders when their data is tracked via `useState` in React components (e.g., custom cursors). This causes severe performance degradation, especially when the component is mounted globally.
**Action:** Use `useRef` to track coordinates and apply direct DOM mutation (e.g., `ref.current.style.left = ...`) instead of `useState` to track coordinates for high-frequency events.
