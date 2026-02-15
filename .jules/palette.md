## 2025-02-18 - Login UX Improvements
**Learning:** `Login.js` relied on `window.alert` for error handling and lacked basic accessibility attributes (htmlFor/id), creating a poor experience for screen readers and users in general.
**Action:** When auditing forms, always check for explicit label associations and replace blocking alerts with inline error messages using `aria-live` regions.
