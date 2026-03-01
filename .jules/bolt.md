## 2025-03-01 - Optimizing React DOM Mutations

**Learning:** Frequent DOM updates bound to React state (like mouse coordinate tracking in `CursorFollower.jsx`) cause continuous full-component re-renders. When bound to rapid events like `mousemove`, this destroys performance and drops frames.
**Action:** When tracking rapid physical events (scroll, mousemove, touch) that only need to update the DOM, use `useRef` to store elements and directly mutate their `.style` properties. This completely bypasses the React Virtual DOM diffing process and ensures smooth 60fps performance without triggering unnecessary renders.
