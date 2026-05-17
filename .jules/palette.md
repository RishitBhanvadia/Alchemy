
## 2024-05-17 - Update Actions Node Version & Fix CSS Imports
**Learning:** GitHub Actions using Node 18 trigger deprecation warnings and can cause `npm ci` / `vite build` to fail when dependencies like `@tailwindcss/oxide` require native bindings for Node 20+. Additionally, Vite + Tailwind v4 build processes fail if native CSS `@import` statements (like Google Fonts) are placed *after* `@import "tailwindcss";`.
**Action:** Keep GitHub Actions `setup-node` tasks on Node 20+ to unblock CI. Always place native `@import url(...)` statements at the very top of the entry CSS file before any Tailwind directives.
