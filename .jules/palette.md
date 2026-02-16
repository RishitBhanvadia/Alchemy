## 2024-05-24 - Login Form Accessibility
**Learning:** Found a pattern of missing `htmlFor` on labels and `id` on inputs in `Login.jsx`. This breaks the programmatic association, making it harder for screen reader users to navigate the form.
**Action:** When creating or updating forms, always ensure labels are explicitly associated with their inputs using matching `htmlFor` and `id` attributes.
