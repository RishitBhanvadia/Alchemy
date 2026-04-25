## 2025-04-25 - Rules of Hooks Precede Early Returns
**Gap:** The Vite build failed because of duplicate identifiers, which masked an underlying hooks issue.
**Learning:** `CursorFollower.jsx` was defining hooks (`useState`) after an early conditional `return` statement (`if (isTouchDevice) return null;`).
**Pattern:** Always define React hooks at the very top of the component, before any conditional returns.
