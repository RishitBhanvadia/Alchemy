
## 2024-05-17 - Address CI ESLint Failures Safely
**Learning:** Fixing eslint errors requires careful attention to React semantics. When replacing dummy `<a>` tags with `<button>`, ensure they don't break expected anchor behaviors if they act as external links, but for internal actions, `<button>` is correct. When silencing `no-static-element-interactions` on `div` overlays, adding `role="presentation"` correctly indicates to screen readers that the `onClick` is for layout management (like closing a modal) and not an interactive widget. Be careful not to delete used state variables when fixing Rules of Hooks errors.
**Action:** Always verify variables aren't used elsewhere before removing them to satisfy a linter, and use `role="presentation"` for non-interactive click-catching overlays.
