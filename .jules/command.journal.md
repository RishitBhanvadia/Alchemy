# Command Journal

## 2026-06-23 — Vite Build Fails on CSS @import Order
**Pattern:** Tailwind CSS v4 `@import` syntax in `index.css` is placed before Google Fonts `@import url(...)`, causing Vite production build to fail.
**Detection:** Build fails with warning/error `@import rules must precede all rules`.
**Prevention:** Always check `index.css` for proper `@import` ordering. Standard CSS `@import` statements must be placed at the absolute top of the CSS file before Tailwind CSS imports.
