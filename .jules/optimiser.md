2024-05-23 - Throttling High-Frequency Event Listeners
**Bottleneck:** Unthrottled mousemove event listeners triggering rapid React state updates and severe layout thrashing.
**Impact:** Significantly reduced main thread blocking and jank by capping state updates to the display refresh rate.
**Learning:** High-frequency DOM events like `mousemove` and `scroll` must be wrapped in `requestAnimationFrame` (and cleaned up with `cancelAnimationFrame`) in React to prevent continuous re-renders from degrading UI performance.
