## 2024-05-24 - React performance optimization for high-frequency events
**Learning:** Using `useState` to store mouse coordinates in a `mousemove` event listener causes continuous component re-renders, severely degrading performance.
**Action:** Use `useRef` to directly manipulate the DOM element's style properties (`style.left`, `style.top`) instead, bypassing the React render cycle entirely for high-frequency updates.
