## 2025-04-13 - Lazy loading Modals in R3F Apps

**Learning:** In React Three Fiber applications, heavy interactive panels or modals (like AiTutorPanel) shouldn't be bundled in the initial chunk if they aren't visible on load. However, simply using `isOpen && <Suspense><Modal/></Suspense>` breaks Framer Motion's `AnimatePresence` exit animations because the component is unmounted immediately before the animation can finish.

**Action:** Track a local initialization state (e.g., `hasOpened`) that becomes `true` on the first interaction and never reverts to `false`. Wrap the lazy component in `{hasOpened && <Suspense><Modal isOpen={isOpen} /></Suspense>}`. This permanently mounts the `<Suspense>` boundary after first use, allowing `AnimatePresence` inside the modal to properly handle the `isOpen` prop for smooth exit animations while still deferring the initial load.
