## 2024-05-24 - Lazy Loading 3D Scenes
**Bottleneck:** Synchronous import of `CanvasContainer` (Three.js) in `Landing.jsx` increased the main entry bundle by ~850kB.
**Impact:** Reduced initial bundle size by ~850kB, moving heavy 3D assets to a separate lazy-loaded chunk.
**Learning:** Three.js components are extremely heavy; always lazy load them, especially for non-critical/decorative UI elements on the landing page, to unblock First Contentful Paint.
