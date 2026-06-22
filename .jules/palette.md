## 2025-06-21 - Anchor tag accessibility rule in ESLint
**Learning:** The Alchemistry client enforces `jsx-a11y/anchor-is-valid`, which throws an error when `href="#"` is used on `<a>` tags.
**Action:** When adding links that don't actually navigate to a new route but act as buttons (like 'Terms of Service', 'Privacy Policy', or 'Forgot password?'), use a semantic `<button type="button">` element styled to look like a link instead. Always ensure appropriate keyboard accessibility via `focus-visible:ring-2` to these buttons.
