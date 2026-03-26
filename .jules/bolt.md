## 2024-05-18 - Avoid React State for High-Frequency DOM Updates

**Learning:** Using `useState` to track high-frequency events like `mousemove` for custom cursors causes severe performance degradation due to constant, synchronous React component re-renders.
**Action:** Use `useRef` to store DOM element references and directly mutate their `style.left` and `style.top` properties within the event listener. This completely bypasses the React render cycle for high-frequency coordinate updates while still maintaining the custom UI.