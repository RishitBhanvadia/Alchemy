## 2024-05-22 - Form Accessibility & Feedback
**Learning:** Forms in this application often lack associated labels (`htmlFor` + `id`), making them inaccessible to screen readers. Additionally, error handling frequently relies on `alert()`, which is disruptive and poor UX.
**Action:** When touching forms, always ensure inputs have `id` matching their label's `htmlFor`. Replace `alert()` with inline error messages and disable submit buttons during loading states to prevent double submissions.
