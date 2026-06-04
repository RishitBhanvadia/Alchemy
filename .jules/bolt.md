## 2024-05-24 - Throttling High-Frequency React State Updates
**Learning:** High-frequency DOM events like `mousemove` can cause severe layout thrashing and performance degradation if they trigger React state updates directly on every event, leading to excessive re-renders.
**Action:** When handling events like `mousemove` or `scroll`, always wrap state updates in a `requestAnimationFrame` (RAF) callback and explicitly call `cancelAnimationFrame(rafId)` to throttle updates to the display's refresh rate.
