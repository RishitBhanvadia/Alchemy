## 2026-04-25 - Fix mobile overflow issues
**Problem:** There are several CSS layout and styling bugs in the application. Notably `max-max-width` appears in many CSS files, `100vw` causes horizontal scrollbars and layout breaks on some screens, and missing focus indicators and error states need fixing.
**Context:** These bugs break the layout, especially on mobile, creating a jarring UX for users accessing their virtual laboratory. Fixing them is critical for usability.
**Solution:** I will use `sed` to replace `max-max-width` with `max-width`, change `100vw` to `100%` in components where it causes horizontal overflow, and fix accessibility issues.
