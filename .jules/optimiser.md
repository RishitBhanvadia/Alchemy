## 2024-04-10 - Throttle R3F State Updates in useFrame
**Bottleneck:** Direct React state setters (`setAmount` and `onPour`) inside the 60fps `useFrame` loop of `DraggableFlask.jsx` caused rapid re-renders of both the flask and parent components.
**Impact:** Significantly reduced React component re-renders from 60fps to ~10fps during pouring interactions, improving framerate and preventing UI freezing, while maintaining visual smoothness via direct mesh mutation.
**Learning:** In React Three Fiber, decouple visual animations from React state. Use refs for 60fps visual updates on meshes, and accumulate values to throttle React state setters and parent callbacks to a lower frequency (e.g., 10fps).

## 2024-04-10 - Lazy Load Heavy Modals in Lab3D
**Bottleneck:** `AiTutorPanel` and `ResultModal` components in `Lab3D.jsx` were standard imports, causing their CSS and JS chunks to be included in the initial `Lab3D` chunk regardless of visibility. The initial `Lab3D` chunk was 16.05 kB (gzip: 5.53 kB) and its CSS was 15.95 kB.
**Impact:** After implementing `React.lazy()` and `<Suspense>`, the main `Lab3D` JS chunk decreased by 31% to 11.07 kB (gzip: 4.06 kB) and its CSS chunk decreased by 43% to 9.07 kB (gzip: 2.30 kB). The heavy modal components (`AiTutorPanel-WX8dEbms.js` and `ResultModal-Dvw52PEq.js`) are now split into separate chunks, reducing the initial load time.
**Learning:** For interactive web apps, heavily complex modals or side panels that are hidden behind user actions (e.g., clicking the 'Ask AI Tutor' button or finishing a reaction) should always be lazily loaded to minimize the initial main chunk size.
