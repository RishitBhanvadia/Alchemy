# Command Journal

## $(date +%Y-%m-%d) — Duplicate Hook Declarations Cause Build Failure
**Finding:** A syntax error was introduced where `useState` hooks were duplicated before and after an early return statement in `client/src/components/CursorFollower.jsx`.
**Learning:** Duplicate variable declarations with `const` cause immediate build failures via `esbuild`. Additionally, placing hooks after conditional returns violates React's Rules of Hooks.
**Prevention:** Always verify build success (`pnpm build`) after editing React components, especially when moving or duplicating code. Ensure ESLint rules for `react-hooks/rules-of-hooks` are enabled and checked.
