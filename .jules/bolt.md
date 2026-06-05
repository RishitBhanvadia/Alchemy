## 2025-06-05 - Throttle High-Frequency DOM Events
**Learning:** High-frequency event listeners (like `mousemove` or `scroll`) update React state multiple times per frame, causing severe layout thrashing and degrading application performance.
**Action:** Wrap state updates triggered by these events in a `requestAnimationFrame` callback and cancel existing frame requests before queuing a new one to ensure updates run exactly once per frame.
