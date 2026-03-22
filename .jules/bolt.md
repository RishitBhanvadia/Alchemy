## 2024-03-22 - Direct DOM Mutation for High-Frequency Events
**Learning:** In React components listening to high-frequency events (like `mousemove` for a custom cursor), tracking coordinates with `useState` triggers excessive full-component re-renders (60+ times per second).
**Action:** Use `useRef` to store DOM element references and directly mutate their `style.left` and `style.top` properties in the event listener to bypass the React render cycle entirely.
