## 2024-06-03 - CursorFollower mousemove throttling
**Learning:** Found a component `CursorFollower.jsx` that attaches `mousemove` directly to the `document` without throttling or using requestAnimationFrame, causing React state (`setPosition`, `setHovering`) to be updated on every single mousemove event. This triggers a huge amount of React re-renders.
**Action:** Always throttle `mousemove` event handlers in React, or use `requestAnimationFrame` when updating mouse position states, to avoid layout thrashing and unnecessary re-renders.
