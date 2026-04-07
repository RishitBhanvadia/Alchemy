## 2024-03-24 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Found several icon-only buttons (like history, AI tutor toggles, and copy code buttons) that used emojis and a `title` attribute, but lacked explicitly defined `aria-label`s. While a `title` attribute may be announced by some screen readers, an `aria-label` is explicitly required for standard robust accessibility of non-text buttons.
**Action:** When adding icon-only or emoji-based interactive elements, always explicitly define `aria-label` even if `title` is present to ensure full screen reader support.
