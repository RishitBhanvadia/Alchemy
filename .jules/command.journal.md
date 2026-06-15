# Command Journal

## 2026-06-15 — CursorFollower State Re-declaration
**Pattern:** `client/src/components/CursorFollower.jsx` has duplicate `useState` declarations for `clicking` and `hovering`.
**Detection:** Build fails with `Transform failed with 4 errors: The symbol "clicking" has already been declared`.
**Prevention:** Remove duplicate variable declarations.

## 2026-06-15 — Tailwind CSS Import Order
**Pattern:** `client/src/index.css` has an `@import` statement after the tailwind import.
**Detection:** Build warning `@import rules must precede all rules aside from @charset and @layer statements`.
**Prevention:** Move the standard css `@import` above `@import "tailwindcss";` in `index.css`.
