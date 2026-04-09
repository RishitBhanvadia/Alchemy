## 2024-04-09 - [Reduce Lab3D initial load time via lazy loading]
**Bottleneck:** Synchronous imports of heavy modal/panel components (`AiTutorPanel`, `ResultModal`) were inflating the initial chunk size for the `Lab3D` route, even though they are conditionally rendered only after user interaction or reaction completion.
**Impact:** Initial chunk size for `Lab3D` reduced from 16.05 kB to 11.07 kB (~31% reduction). CSS chunks were also split off effectively.
**Learning:** Always `lazy` import large interactive panels or modals that are not visible on initial load in React Three Fiber applications to save initial parsing and execution time on the main thread.
