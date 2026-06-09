## 2024-06-09 - Throttle DOM events
**Learning:** Frequent DOM event listeners (like mousemove or scroll) cause severe layout thrashing by updating state directly on every frame.
**Action:** Wrap state updates for frequent DOM events in a `requestAnimationFrame` callback to throttle updates and explicitly cancel the frame to avoid memory leaks. Also, consider removing unused event listeners completely on platforms that don't use them (like touch devices) inside the effect itself to prevent unneeded overhead.
