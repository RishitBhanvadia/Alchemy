## 2024-04-07 - Accessibility Test Failures due to Missing htmlFor
**Gap:** Form inputs in custom components lacked proper accessibility attributes (`htmlFor`, `aria-invalid`, `aria-describedby`), causing tests relying on `getByLabelText` to fail.
**Learning:** Testing Library's `getByLabelText` strictly enforces accessibility best practices. If a label isn't correctly associated with its input, the query will fail, effectively acting as an implicit accessibility test.
**Pattern:** Ensure custom input components (like `InputField.jsx`) include `htmlFor={name}` on labels, and correctly link error messages using `aria-invalid` and `aria-describedby` to the input element with matching `id`.
