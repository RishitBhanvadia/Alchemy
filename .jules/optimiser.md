## 2024-03-24 - Titration Timer Optimization

**Bottleneck:** The `Titration` component's timer `useEffect` depended on `count` (updated every 100ms) and `isCounting`. This caused the `setInterval` to be torn down and recreated on every tick (every 100ms), leading to unnecessary overhead and potential jitter. Additionally, `acid_heigth` was stored as redundant state, causing double state updates and re-renders for a value that is purely derivative of `count`.

**Impact:** Eliminated ~10 interval creations/destructions per second during titration. Removed one state variable (`acid_heigth`) and its associated setter calls. Reduced re-render triggers (though React batching may have mitigated this, the logic is now strictly cleaner). The UI update is now driven by a single state source of truth (`count`).

**Learning:** When using `setInterval` in `useEffect`, avoid including the changing value (like `count`) in the dependency array. Instead, use the functional update form of the state setter (`setCount(prev => prev + 1)`) to access the current value without triggering a re-effect. Derived state should be calculated during render, not synchronized via effects or redundant state setters.
