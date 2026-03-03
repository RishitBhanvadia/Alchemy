# Palette Journal

## 2026-03-03 - Async Button Loading States
**Learning:** Adding loading states to authentication forms (like Login) is critical for UX, preventing double-submissions and providing immediate feedback. The existing tests also expect the text to change to "ACCESSING..." during this state, indicating it is an integrated requirement.
**Action:** Always include a disabled loading state (`disabled`, `aria-busy`) with clear textual/visual feedback for asynchronous form submissions, and ensure styling visually indicates the disabled state (e.g., lower opacity, not-allowed cursor, disabled hover effects).