## 2026-05-08 - Accessible Form Validation
**Learning:** Custom form validation error messages are not automatically read by screen readers when focus remains on the input field. The `aria-invalid` attribute must be set, and the input must be explicitly linked to the error container via `aria-describedby` matching the error container's `id`. The error container should also act as an alert using `role="alert"`.
**Action:** Always link custom error components to their inputs using `aria-invalid` and `aria-describedby` with `role="alert"` for the error text.
