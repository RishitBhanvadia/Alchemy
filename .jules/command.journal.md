# Command Journal

## 2026-06-20 — Syntax Errors Break Build
**Finding:** A syntax error (duplicate variable declarations) in `client/src/components/CursorFollower.jsx` caused the client build to fail.
**Learning:** Even simple syntax issues can block deployment.
**Prevention:** Ensure agents run `pnpm lint` and `pnpm build` after modifying files to catch syntax errors early.
