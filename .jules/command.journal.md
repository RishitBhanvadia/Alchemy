# Command Journal

## 2026-05-08 — Duplicate Variable Declarations Break Esbuild
**Pattern:** Duplicate variable/state declarations cause `vite build` (esbuild) to fail immediately.
**Detection:** `npm run build` fails with `The symbol "[name]" has already been declared`.
**Prevention:** Command should check for duplicate variable or hook declarations in PR diffs, especially around early returns or conditionals where an agent might have copied code without removing the original.
