## 2025-05-10 - CursorFollower Re-Render Optimization
**Learning:** High-frequency event listeners (like `mousemove` triggering ~60+ times per second) bound to React `useState` setters cause severe performance degradation due to triggering full component re-renders for every single pixel move.
**Action:** Always replace `useState` with `useRef` to directly manipulate DOM node styles (`element.style.left`, `element.style.top`, `classList`) for tracking mouse coordinates and hover states in interactive or custom cursor components, bypassing the React render cycle completely.
