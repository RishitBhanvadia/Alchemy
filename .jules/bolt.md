## 2024-05-24 - Optimize React rendering for high-frequency events
**Learning:** React components that track mouse coordinates using `useState` trigger excessive re-renders on every `mousemove` event (60+ FPS). Using `ref.current.style.transform` directly is more performant but can override CSS positioning rules like centering.
**Action:** Used `useRef` to maintain references to DOM nodes and applied positioning directly to `left` and `top` properties via JavaScript, avoiding React's render lifecycle entirely while maintaining CSS compatibility.
