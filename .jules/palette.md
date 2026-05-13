## 2024-05-13 - Add ARIA Labels to Icon-Only Buttons
**Learning:** Found multiple instances where icon-only buttons lacked aria-labels for screen readers (e.g. the toggle lock chemical button, copy to clipboard, AI tutor panel toggle), which is an accessibility issue for assistive technologies.
**Action:** Always verify icon-only buttons use an `aria-label` attribute or have visually hidden text so screen readers can describe their action properly.
