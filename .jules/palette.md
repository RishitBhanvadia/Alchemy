## 2026-06-15 - Empty State Refactoring
**Learning:** Hard-coded "empty messages" disrupt the consistency and visual hierarchy of the application. Using reusable empty states makes pages feel properly considered rather than broken or empty.
**Action:** Always prefer the `<EmptyState />` component over `<p className="empty-msg">` for lists or tables with no data to improve visual consistency and user trust.
