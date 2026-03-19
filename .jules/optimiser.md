## 2024-03-19 - Optimise CursorFollower performance

**Bottleneck:** CursorFollower was causing an excessive number of React component re-renders because it updated React state (`position: {x, y}`) on every single `mousemove` event across the entire application.

**Impact:** Substantially reduced main thread work and entirely eliminated React rendering cycles for simple cursor movements. The React DevTools Profiler shows zero renders for CursorFollower during `mousemove` over non-interactive elements, whereas before it would re-render continuously.

**Learning:** Using `useRef` to directly manipulate DOM elements (`element.style.left` and `element.style.top`) is vastly superior to `useState` for tracking high-frequency events like cursor coordinates. We must also check state (`prevHovering !== newHovering`) before calling `setState` to avoid redundant state updates when hovering status hasn't changed.
