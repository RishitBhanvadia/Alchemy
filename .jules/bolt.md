## 2024-10-27 - Custom Cursor Re-renders
**Learning:** In React, storing high-frequency event data (like `mousemove` coordinates for a custom cursor) in `useState` triggers rapid, full component re-renders that severely degrade performance.
**Action:** Use `useRef` to hold references to the DOM nodes and update their styles and classes directly within the event listeners, bypassing React's render cycle completely.
## 2024-10-27 - Custom Cursor Re-renders
**Learning:** In React, storing high-frequency event data (like `mousemove` coordinates for a custom cursor) in `useState` triggers rapid, full component re-renders that severely degrade performance.
**Action:** Use `useRef` to hold references to the DOM nodes and update their styles and classes directly within the event listeners, bypassing React's render cycle completely.
