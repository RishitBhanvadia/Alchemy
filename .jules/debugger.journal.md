## 2024-05-24 - Resolve GitHub Actions Node Version Issue
**Bug:** The GitHub Actions CI check suite fails on standard workflows because Node.js 18.x and 20.x are used with the outdated `actions/checkout@v4` and `actions/setup-node@v4` on `ubuntu-latest`, and local packages expect `node: ">= 20"`.
**Root Cause:** The `node-version` in `.github/workflows` was set to `18` or `18.x`, which caused package inconsistencies and build step failures (specifically with `tailwindcss/oxide` missing bindings).
**Learning:** Always ensure the `.github/workflows/` files explicitly use `node-version: '20'` or higher when relying on `@tailwindcss/oxide` and modern Vite builds.
