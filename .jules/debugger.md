## 2025-05-05 - Fix hasOverdueAssignments false positives with no due date
**Bug:** Assignments without a due date (`null` or empty) were being incorrectly flagged as overdue.
**Root Cause:** In JavaScript, `new Date(null)` evaluates to the UNIX epoch (1970), which is always earlier than the current date. The logic `new Date(a.due_date) < now` was returning true for these cases.
**Learning:** Always verify that a date variable is truthy before passing it to the `Date` constructor to avoid logic bugs in date comparisons.
