## 2024-04-03 - Vitest multiple matches
**Gap:** Login component form elements match multiple tests
**Learning:** In components with multiple forms (like Login and Signup), simple `getByLabelText` and `getByRole` queries can fail if the element is not explicitly uniquely scoped.
**Pattern:** For `getByLabelText`, you can disambiguate multiple identical labels in the DOM via using `getAllByLabelText()[0]` or specifically target `LoginForm`.
