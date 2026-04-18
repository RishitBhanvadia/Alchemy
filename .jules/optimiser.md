## 2024-04-18 - Avoid useState for high-frequency events
**Bottleneck:** Using `useState` inside a `mousemove` event handler triggered unnecessary component re-renders for every pixel moved, causing severe performance degradation.
**Impact:** Significantly reduced React rendering overhead. User perceived tracking smoothness will be vastly improved and stuttering reduced.
**Learning:** For high-frequency DOM events (e.g., `mousemove`, `scroll`), use `useRef` to hold a reference to DOM elements and directly manipulate their properties (like `style.left`) to completely bypass the React render cycle.
