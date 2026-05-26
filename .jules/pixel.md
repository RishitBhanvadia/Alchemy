## $(date +%Y-%m-%d) - Improve RoleSelector accessibility
**Problem:** The custom role selector (Student vs Teacher) on the sign up page was implemented using divs that weren't accessible via keyboard navigation.
**Context:** For a modern accessible web app, users need to be able to navigate form elements like role selection using keyboard (Tab, Enter/Space) rather than just clicking.
**Solution:** Added `role="radiogroup"` to the container and `role="radio"`, `aria-checked`, `tabIndex={0}`, and an `onKeyDown` handler to the custom role cards to make them fully accessible while retaining their visual design.
