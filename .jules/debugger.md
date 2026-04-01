## 2024-05-24 - React Testing Library `getByLabelText` Resolution
**Bug:** Vitest failures due to React Testing Library unable to find element by label text.
**Root Cause:** Custom input component `<InputField />` had an unassociated `<label>` element because it was missing the `htmlFor` attribute that matched the underlying input's `id`.
**Learning:** In the Alchemistry React client, when using React Testing Library's `getByLabelText`, ensure custom input components explicitly pass the `htmlFor` attribute to the `<label>` element matching the underlying input's `id`.
