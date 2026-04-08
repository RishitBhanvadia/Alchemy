## 2024-05-24 - Avoid State Setters in useFrame
**Learning:** React state setters inside the 60fps `useFrame` loop trigger excessive parent component re-renders, causing severe performance degradation in React Three Fiber (R3F) applications.
**Action:** Accumulate or throttle values inside `useFrame` and trigger the state update callback at a lower rate (e.g., 10-15fps) to prevent rapid parent re-renders.
