## 2024-04-18 - React state on mousemove events causes extreme render churn
**Learning:** Using `useState` on high-frequency events like `mousemove` triggers full component re-renders for every pixel movement, which severely degrades React application performance.
**Action:** When tracking high-frequency DOM events (like mouse positions or scrolling), maintain element references with `useRef` and bypass the React render cycle by directly updating DOM properties (e.g., `ref.current.style.left`).
