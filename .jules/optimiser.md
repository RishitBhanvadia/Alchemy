## 2025-02-23 - Resolve Build Errors in Client App
**Bottleneck:** Duplicate variable declarations and improperly formatted CSS @import were preventing the Vite production build from succeeding, causing a critical failure.
**Impact:** Unblocked the production build step for the application.
**Learning:** Addressed esbuild syntax errors (duplicate declaration of states) and CSS warnings (ordering of @import) to ensure the client application can be properly bundled.
## 2025-02-23 - Throttling mousemove in React Components
**Bottleneck:** Unbounded DOM event listeners (like `mousemove`) in React components cause excessive state updates and re-renders, potentially freezing or heavily lagging the UI thread during high-frequency user interactions.
**Impact:** Prevents severe layout thrashing by aligning state updates to the browser's 60FPS painting cycle, improving general interaction speed and responsiveness.
**Learning:** High-frequency event listeners should wrap their React state updates within a `requestAnimationFrame` block, maintaining a reference to the `rafId` via `useRef`, and clearing any existing frame via `cancelAnimationFrame` before requesting a new one. This ensures we don't pile up synchronous state updates in the event queue.
