# Tester Journal

## 2024-05-24 - Login Component Test Failure Fix
**Gap:** The tests for `Login` component were failing because they couldn't find inputs by their labels.
**Learning:** React Testing Library's `getByLabelText` strictly depends on correct HTML semantics (the `for` / `htmlFor` attribute linking a `<label>` to its corresponding `<input>` via its `id`). The generic `InputField` component had a `<label>` without the `htmlFor` attribute.
**Pattern:** Always pass down `htmlFor={id}` or `htmlFor={name}` in custom input components to ensure screen readers and testing libraries can associate labels with their inputs correctly.
