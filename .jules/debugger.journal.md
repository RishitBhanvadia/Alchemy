## 2026-04-04 - Fix missing htmlFor attribute in form labels

**Bug:** `Login.test.jsx` test cases were failing because React Testing Library's `getByLabelText` could not locate input fields.
**Root Cause:** Custom `<label>` elements inside `InputField.jsx` did not have an `htmlFor` attribute linking them to their corresponding `<input>` field's `id`. This breaks both accessibility and testing queries.
**Learning:** Always ensure that custom form input components include the `htmlFor={name}` attribute on their `<label>` elements to correctly associate the label with the input. This is critical for both screen readers (accessibility) and UI testing frameworks like React Testing Library.