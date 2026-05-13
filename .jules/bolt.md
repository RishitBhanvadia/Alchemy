## 2025-05-13 - [Optimize CursorFollower Component]
**Learning:** High-frequency event listeners like `mousemove` that trigger React state updates can cause severe performance degradation due to constant re-renders.
**Action:** Use `useRef` to maintain references to DOM elements and modify their styles and classLists directly within the event listener to avoid unnecessary component re-renders.
