## 2024-04-30 - Date Comparison Handling of null Due Dates
**Bug:** `hasOverdueAssignments` returns `true` for pending assignments with no due date (when `due_date` is `null`).
**Root Cause:** In JavaScript, `new Date(null)` evaluates to the Unix epoch (1970-01-01), which is always `< now`, causing assignments without due dates to be incorrectly flagged as overdue.
**Learning:** Always check if a date value is truthy (or specifically not null/undefined) before passing it to `new Date()` for comparison logic.
