## 2026-04-24 - Build Crash Fix
**Bug:** Client build crashed due to duplicated variable declarations and CSS `@import` order issue.
**Root Cause:** `CursorFollower.jsx` had duplicated `useState` declarations for `clicking` and `hovering`. Also, `index.css` placed `@import url()` after `@import "tailwindcss";`, which is invalid in the CSS standard.
**Learning:** Always verify standard CSS import rules and maintain clean state declarations to avoid parsing errors.
