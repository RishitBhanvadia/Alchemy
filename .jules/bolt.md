## 2026-03-19 - Avoid setState for High-Frequency Events
**Learning:** Using React `useState` to track mouse coordinates in global `mousemove` handlers causes excessive re-renders across the component tree, severely degrading frontend performance during high-frequency events.
**Action:** Always use `useRef` to hold DOM element references and directly mutate their `style` properties (e.g., `ref.current.style.transform`) to bypass React's render cycle for fluid UI interactions like custom cursors.
