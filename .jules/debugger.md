## 2026-05-16 - Parsing Error in React Component
**Bug:** The `CursorFollower` component was crashing with a parsing error: "Identifier 'clicking' has already been declared".
**Root Cause:** Two state variables (`clicking` and `hovering`) were declared twice in the component scope. The initial set of declarations occurred *after* an early conditional return (`if (isTouchDevice) return null;`), which also violated the Rules of Hooks by changing the call order on touch vs. non-touch devices.
**Learning:** Always place early returns in React components *after* all `useState` and `useEffect` hook declarations. Duplicate state declarations often occur during hasty refactoring when logic is moved above/below early returns without cleaning up the original definitions.
