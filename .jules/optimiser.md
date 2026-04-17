## 2025-04-17 - CursorFollower Re-Render Optimization
**Bottleneck:** The `CursorFollower` component uses `useState` to track `position` and attaches it directly to the `mousemove` event, which triggers a full re-render on every pixel the mouse moves. This severely degrades performance.
**Impact:** Eliminating re-renders for cursor updates significantly reduces CPU overhead and improves smoothness across all UI interactions.
**Learning:** Using `useState` for high-frequency events (like `mousemove`) forces unnecessary React renders. Modifying `ref.current.style` directly completely bypasses the React render cycle, resulting in orders of magnitude better performance.
