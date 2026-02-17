# Debugger's Journal

## 2026-02-17 - React State Synchronization
**Bug:** Test tube color updated with a lag (one interaction behind) after slider movement.
**Root Cause:** The `change_tip` function was called immediately after `setChemA`, using the stale state value from the current closure instead of the updated value.
**Learning:** Use `useEffect` for logic that depends on state updates, ensuring the effect runs with the fresh state after re-render. Alternatively, pass the new value directly to the function if immediate execution is required within the handler.
