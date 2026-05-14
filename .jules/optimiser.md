## 2024-05-14 - Fix initial bundle error and cursor performance
**Bottleneck:**
1. Build failed due to duplicate declarations in `CursorFollower.jsx`
2. `index.css` esbuild warning for incorrect `@import` order
3. `CursorFollower.jsx` uses standard state setters which causes layout thrashing and re-renders on every `mousemove` event.

**Impact:** Fixes a broken build and drastically reduces render overhead on cursor movement.

**Learning:**
1. `vite build` correctly flags `@import url` placed after `@import "tailwindcss"`. Must follow CSS spec.
2. In React components tracking high-frequency events (like `mousemove`), use `useRef` and direct DOM manipulation instead of `useState` to prevent massive re-render cycles.
