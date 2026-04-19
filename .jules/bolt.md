## 2024-05-25 - React mousemove Re-renders
**Learning:** Attaching `useState` to high-frequency events like `mousemove` causes severe performance degradation due to constant React re-renders.
**Action:** Use `useRef` to store DOM element references and update their inline styles or classes directly in the event listener, completely bypassing the React render cycle for microscopic UI updates.
