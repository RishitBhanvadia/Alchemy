
## 2025-02-24 - Prevent synchronous re-renders in custom cursor
**Learning:** Using `useState` for tracking high-frequency `mousemove` events in a React application causes massive rendering jank and unneeded CPU usage, particularly problematic when rendering alongside a 3D Three.js canvas.
**Action:** Always use `useRef` to directly mutate DOM node `style.transform` properties instead of React state for rapid continuous events like a custom mouse cursor.
