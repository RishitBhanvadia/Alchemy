## 2024-05-18 - Throttle React state updates inside useFrame
**Bottleneck:** High CPU usage and rapid component re-renders due to `setAmount` and `onPour` state setters being called inside the 60fps `useFrame` loop in `DraggableFlask.jsx`.
**Impact:** Significantly reduced parent component re-renders and CPU usage, improving interaction performance during the drag-and-pour action.
**Learning:** Avoid invoking React state setters directly inside the 60fps `useFrame` loop in React Three Fiber (R3F) components, as this triggers severe performance degradation. Instead, throttle or accumulate the values and trigger the state update callback at a lower rate or upon interaction completion.
