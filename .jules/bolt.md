## 2026-02-19 - Optimization of Titration Simulation
**Learning:** React state updates and interval recreation in a tight loop (animation) cause significant performance overhead. Removing unnecessary state (derived state) and optimizing `useEffect` dependencies can drastically reduce re-renders. Also, memoizing static-ish components like `Navbar` prevents cascading re-renders.
**Action:** Always check if state can be derived. Always check `useEffect` dependencies when using `setInterval`.
