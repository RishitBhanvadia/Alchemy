
## 2024-05-24 - Fix missing label association for input fields
**Problem:** The custom `InputField` component used in the authentication forms had `<label>` elements without the `htmlFor` attribute.
**Context:** This caused an accessibility violation as screen readers could not properly associate the label with its corresponding `<input>`, leading to user friction and testability issues.
**Solution:** Added `htmlFor={name}` to the `<label>` to explicitly link it to the `id={name}` of the input element.
