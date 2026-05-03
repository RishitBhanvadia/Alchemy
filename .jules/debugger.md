## 2025-02-20 - Fix Date(null) comparison bug in assignment logic
**Bug:** Assignments without a `due_date` (null) were incorrectly marked as overdue.
**Root Cause:** The `hasOverdueAssignments` logic evaluated `new Date(a.due_date) < now`. In JavaScript, `new Date(null)` creates a valid date set to the Unix epoch (`1970-01-01T00:00:00.000Z`), which is always less than `now`.
**Learning:** Always verify that a date variable is truthy (or explicitly not null/undefined) before passing it to the `Date` constructor, especially when dealing with optional dates from APIs or databases.
## 2025-02-20 - Fix ARIA role prop collision and invalid anchor accessibility
**Bug:** The CI pipeline failed due to `jsx-a11y/aria-role` and `jsx-a11y/anchor-is-valid` lint errors.
**Root Cause:** The custom prop name `role` in `RoleCard` and `SignUpForm` collided with the standard HTML/ARIA `role` attribute, triggering ESLint to validate the custom string (like "student") against the ARIA spec. Additionally, using `<a href="#">` without a valid URL breaks accessibility guidelines for screen readers.
**Learning:** Avoid using `role` as a custom prop for component state (e.g., user types); use alternatives like `userRole`. Always replace `<a href="#">` with `<button type="button">` if the element acts as an interactive trigger rather than a true navigation link.
