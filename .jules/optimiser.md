## 2024-05-18 - Lazy Load Modal Components
**Bottleneck:** Heavy interactive panels or modal components (like `AiTutorPanel` and `ResultModal`) were being bundled into the initial load, increasing bundle chunk size and delaying the loading of the core 3D simulation.
**Impact:** Drastically reduced initial chunk size by lazy-loading components that are not visible on initial load.
**Learning:** To preserve Framer Motion `AnimatePresence` exit animations with lazy-loaded components, do not conditionally unmount them based on their active state (e.g., `isOpen`). Instead, track a local `hasOpened` state (updated within a `useEffect`) and render the `Suspense` boundary permanently after the first interaction.
