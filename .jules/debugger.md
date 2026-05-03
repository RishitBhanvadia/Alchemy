## 2025-02-20 - Fix Date(null) comparison bug in assignment logic
**Bug:** Assignments without a `due_date` (null) were incorrectly marked as overdue.
**Root Cause:** The `hasOverdueAssignments` logic evaluated `new Date(a.due_date) < now`. In JavaScript, `new Date(null)` creates a valid date set to the Unix epoch (`1970-01-01T00:00:00.000Z`), which is always less than `now`.
**Learning:** Always verify that a date variable is truthy (or explicitly not null/undefined) before passing it to the `Date` constructor, especially when dealing with optional dates from APIs or databases.
