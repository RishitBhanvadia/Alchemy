## 2024-04-02 - React Testing Library and htmlFor in Login component
**Learning:** In the Alchemistry client, to ensure React Testing Library tests pass (e.g. `screen.getByLabelText`), you must explicitly set the `htmlFor` attribute on `<label>` elements to perfectly match the corresponding input's `name` or `id`. Missing this attribute will cause accessibility queries to fail during tests.
**Action:** When creating forms or inputs (like the reusable `InputField`), always provide an `htmlFor` attribute that targets the input's `id` to maintain testability and accessibility.
