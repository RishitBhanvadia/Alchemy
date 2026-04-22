## 2025-04-22 - Fix CSS @import ordering warning

**Bug:** A CSS parsing warning disrupted the Vite production build (`npm run build`) in the client application: `@import rules must precede all rules aside from @charset and @layer statements`.

**Root Cause:** In `client/src/index.css`, the standard Google Fonts `@import url(...)` rule was placed immediately *after* the framework-specific `@import "tailwindcss";` directive. Modern CSS parsers and Vite's build optimizer require native `@import url()` statements to be strictly at the absolute top of the CSS file.

**Learning:** When configuring entrypoint CSS files in Vite/Tailwind v4 architectures, always place native CSS imports (like external fonts) before framework imports (like `@import "tailwindcss";`) to prevent optimization warnings and ensure cross-browser compatibility.
