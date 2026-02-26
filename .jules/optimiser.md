## 2024-05-22 - Replaced useState with direct DOM manipulation for CursorFollower
**Bottleneck:** `CursorFollower` component was using `useState` to update position on every `mousemove` event (60+ times per second).
**Impact:** Eliminated unnecessary React re-renders on mouse movement. Improved responsiveness and reduced CPU usage, especially on lower-end devices.
**Learning:** For high-frequency events like mouse movement or scroll, avoid `useState` updates. Use `useRef` to store DOM elements and update `style` (specifically `transform`) directly. This bypasses the React reconciliation cycle entirely for position updates.
