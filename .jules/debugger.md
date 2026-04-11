## 2025-02-28 - Fix CI errors for aria rules and missing props
**Bug:** Multiple lint errors including `no-unused-vars` (useCallback, Check, Loader2), `jsx-a11y/anchor-is-valid`, `jsx-a11y/aria-role`, `react/prop-types`, `no-console`, and `jsx-a11y/click-events-have-key-events`.
**Root Cause:** Using actual `<a>` tags with `href="#"` instead of buttons, failing to apply required roles/handlers to interactive `div`s, and not adding missing prop-types validation.
**Learning:** For interactive UI elements, replace them with `<button type="button">` and apply appropriate styles. Add missing `propTypes` imports, implement proper keyboard events, use `/* eslint-disable-next-line ... */` on overlay wrappers to suppress static element warnings safely, and remove unneeded code.
