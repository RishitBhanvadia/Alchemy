## 2024-03-11 - Use Global CSS Tokens
**Problem:** Text on login, landing and dashboard pages were missing CSS properties and breaking styles due to undefined variables (`--text-white`, `--text-gray`, `--primary-blue`, `--secondary-purple`).
**Context:** The app's global tokens are defined in `client/src/index.css` (e.g., `--text-main`, `--text-muted`, `--primary-neon`, `--secondary-neon`). Pages must use these core variables instead of arbitrary naming conventions that break consistency and invisible text for certain components.
**Solution:** Removed arbitrary CSS variable references in `login.css`, `landing.css`, and `dashboard.css`, and mapped them to the correct, existing tokens from `index.css`.
