## 2023-10-27 - [Node.js Environment Mismatches in CI]
**Bug:** CI pipelines failing on `vite build` due to `@tailwindcss/oxide` native binding errors ("Cannot find native binding").
**Root Cause:** The GitHub Actions pipelines were hardcoded to use Node.js 18. Modern Vite plugins and tools (like `@tailwindcss/oxide`) have started requiring newer Node.js versions (20+) and their native C++ bindings fail to compile or link correctly under Node.js 18.
**Learning:** Ensure CI environments align with memory prerequisites (Node.js 20 or higher) for projects utilizing modern Vite and Tailwind dependencies. Always bump `actions/setup-node` `node-version` keys simultaneously across all CI workflow files.
