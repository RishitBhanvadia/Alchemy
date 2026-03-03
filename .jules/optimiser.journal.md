## 2026-03-03 - Lazy Initialisation in useState
**Bottleneck:** The result.jsx page synchronously parsed the 'cart' localStorage item on every re-render (which includes 3D animations and layout shifts).
**Impact:** A noticeable reduction in main thread blocking time during continuous state updates in the Result component.
**Learning:** For expensive synchronous operations like JSON.parse() during useState initialization, always use a lazy initialization function to ensure it's evaluated only on the initial render.
