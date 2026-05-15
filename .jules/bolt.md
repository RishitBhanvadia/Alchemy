## 2026-05-15 - CursorFollower re-renders
**Learning:** The CursorFollower component was causing continuous React re-renders on every mousemove event by storing cursor coordinates in state, heavily degrading performance.
**Action:** Replaced the position state with refs and directly manipulated the DOM elements' inline styles to bypass React's render cycle for high-frequency events.
