## 2026-02-20 - Stale State Logic Error in Event Handlers
**Bug:** Test tube color updated with the previous value instead of the current value when dragging sliders.
**Root Cause:** Calling a calculation function `change_tip()` immediately after `setState()` inside an event handler. React state updates are asynchronous, so `change_tip()` used stale state from the closure.
**Learning:** Always use `useEffect` to trigger side effects that depend on state changes, rather than calling side-effect functions directly in event handlers after state setters. Tests should verify immediate UI updates after user interaction.
