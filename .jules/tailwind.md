## 2024-05-10 - Tailwind CSS Import Order
**Gap:** The Vite CSS build failed with an error: `@import must precede all other statements`.
**Learning:** Tailwind CSS v4 relies on the `@import "tailwindcss";` statement as its foundation. While standard CSS dictates that `@import url(...)` rules (like Google Fonts) must precede everything except `@charset` and `@layer`, the new Tailwind v4 compiler built on PostCSS/LightningCSS enforces that `@import "tailwindcss";` should come *before* remote font imports to parse the CSS tree correctly in Vite builds.
**Pattern:** Always place `@import "tailwindcss";` at the absolute top of the CSS entry point (e.g. `index.css`), even before `@import url(...)` statements.
