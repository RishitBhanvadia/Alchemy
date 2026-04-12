## 2023-10-27 - Lazy load non-critical heavy modals
**Learning:** Initial bundle size in Alchemistry 3D apps can be bloated by heavy UI panels like `AiTutorPanel` and `ResultModal` that are not visible to the user on initial load.
**Action:** Use `React.lazy` and track a 'hasOpened' state locally. Render `Suspense` wrapping the lazy-loaded component ONLY after it's been triggered once, which defers the download of these chunks until required without breaking Framer Motion exit animations.
