## 2024-03-31 - Fix InputField label accessibility
**Bug:** Login tests failing because `getByLabelText` could not find input fields.
**Root Cause:** The `label` elements in `InputField.jsx` did not have an `htmlFor` attribute linking them to their respective `input` elements, breaking accessibility and testing relying on label associations.
**Learning:** Always ensure `label` elements are programmatically associated with form controls using the `htmlFor` prop (matching the `id` of the input) to support accessibility tools and testing libraries like `@testing-library/react`.
