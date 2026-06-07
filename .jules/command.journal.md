# Command Journal

## 2026-06-07 — Unknown Agent Forgets to move Hooks
**Pattern:** Early return was placed before hooks in CursorFollower.
**Detection:** Build failed with duplicate declarations and linting rules fail.
**Prevention:** Make sure hooks are at the top of components and early returns below them.
