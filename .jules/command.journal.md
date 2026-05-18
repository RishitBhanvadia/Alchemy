# Command Journal

## 2024-05-18 — Frontend CSS Import and State Duplication
**Finding:** The frontend build failed due to duplicated state declarations in `CursorFollower.jsx` and incorrect `@import` order in `index.css`.
**Learning:** Tailwind v4+ requires native CSS imports to precede `@import "tailwindcss";`.
**Prevention:** Command should check for duplicated state variables and CSS import order during code reviews.