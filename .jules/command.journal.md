# Command Journal

## 2026-06-10 — React hook rules in CursorFollower
**Finding:** The `CursorFollower.jsx` component had `useState` hooks declared after an early return (`if (isTouchDevice) return null;`), causing a build error alongside duplicate variable declarations.
**Learning:** Early returns must strictly occur after all React hooks have been declared to avoid violating the rules of hooks.
**Prevention:** Linter configurations should be strict about the `react-hooks/rules-of-hooks` rule, and agents must carefully read files to check for early returns before adding new hooks.

## 2026-06-10 — Tailwind CSS @import ordering
**Finding:** In Tailwind v4, standard CSS `@import url(...)` statements must be placed *before* the `@import "tailwindcss";` directive, otherwise the Vite build outputs warnings.
**Learning:** PostCSS/Tailwind expands the `@import "tailwindcss";` directive into multiple CSS rules. Standard CSS requires `@import` statements to be at the absolute top of the file, so any `@import url(...)` after Tailwind's directive becomes invalid.
**Prevention:** Always place external CSS imports at the very beginning of the `index.css` file.
