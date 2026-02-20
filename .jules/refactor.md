## 2026-02-20 - Derived State vs Imperative Updates in React
**Before:**
The `Lab.jsx` component used individual state variables (`chemA`, `chemB`...) and an imperative helper function `change_tip()` called after `setChemX()` to update the color. This caused synchronization bugs where the color update lagged behind the state change because `change_tip` read the old state from the closure.

**Issue:**
Imperative state updates relying on closure values lead to synchronization bugs and race conditions in React.

**Learning:**
Switching to derived state (using `useMemo` or just calculating during render) based on a consolidated state object (`chemicals`) eliminated the bug entirely. This pattern also enabled configuration-driven rendering (mapping over a config array), significantly reducing code duplication (DRY) and making the component extensible without code changes.
