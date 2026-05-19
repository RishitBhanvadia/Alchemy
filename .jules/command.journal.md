# Command Journal

## 2026-05-19 — CursorFollower Build Failure
**Finding:** A recent change to `client/src/components/CursorFollower.jsx` introduced duplicated state declarations (`clicking`, `setClicking`, `hovering`, `setHovering`) causing esbuild to fail.
**Learning:** Tools or agents that move lines of code (like early returns) to satisfy Rules of Hooks can sometimes accidentally duplicate state variables instead of moving them.
**Prevention:** Always verify build success (`npm run build`) after seemingly trivial hook reorganizations.
