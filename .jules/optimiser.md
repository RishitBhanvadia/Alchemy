## 2024-05-20 - Use useRef for high-frequency DOM updates
**Bottleneck:** High-frequency events (like `mousemove` in `CursorFollower.jsx`) triggering continuous component re-renders when setting state using `useState`.
**Impact:** Eliminates constant React re-renders, greatly improving responsiveness and decreasing CPU usage and lag while moving the mouse.
**Learning:** When dealing with events that fire tens of times per second (e.g., mousemove, scroll), do not store coordinates in React state. Instead, use `useRef` to directly manipulate DOM node styles to bypass the React rendering cycle.
