## 2024-04-09 - Throttle React State Updates in useFrame
**Learning:** Calling React state setters directly inside useFrame at 60fps causes severe performance degradation due to rapid parent re-renders.
**Action:** Always accumulate values in a useRef and throttle the React state updates to a lower framerate (e.g., 10fps) and flush any remaining accumulated values when the interaction ends.
