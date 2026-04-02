## YYYY-MM-DD - Missing htmlFor in Label Component
**Bug:** The `<label>` in `InputField.jsx` was missing the `htmlFor` property linking it to the input element by `id`.
**Root Cause:** The `htmlFor={name}` property was not explicitly passed to the `<label>` mapping to the `<input id={name}>`.
**Learning:** Always ensure custom input wrapper components propagate `htmlFor`/`id` linking correctly. This is particularly important for tests utilizing React Testing Library's `getByLabelText`, preventing `TestingLibraryElementError`s during interactions, and improving screen reader accessibility.
