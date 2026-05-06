## 2024-05-06 - Double Declaration in Component
**Bug:** Build/Test failure due to duplicate state declaration in `CursorFollower.jsx`
**Root Cause:** The variables `clicking` and `hovering` along with their setter functions were declared twice using `useState`.
**Learning:** Always check for duplicate declarations when inserting conditionals like early returns. Ensure variables are scoped properly.
