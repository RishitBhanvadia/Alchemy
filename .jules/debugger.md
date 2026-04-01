## 2024-05-24 - React Testing Library `getByLabelText` Resolution
**Bug:** Vitest failures due to React Testing Library unable to find element by label text.
**Root Cause:** Custom input component `<InputField />` had an unassociated `<label>` element because it was missing the `htmlFor` attribute that matched the underlying input's `id`.
**Learning:** In the Alchemistry React client, when using React Testing Library's `getByLabelText`, ensure custom input components explicitly pass the `htmlFor` attribute to the `<label>` element matching the underlying input's `id`.

## 2024-05-24 - ESLint `jsx-a11y` Accessibility Fixes
**Bug:** CI test job failing due to ESLint `jsx-a11y` errors for anchor tags without valid hrefs, custom components using reserved HTML attributes (role), and unused imports.
**Root Cause:** Anchor tags (`<a>`) were using `href="#"` which violates the `anchor-is-valid` rule. The `<RoleCard>` component accepted a `role` prop which ESLint misinterpreted as the native ARIA `role` attribute, violating `aria-role`. Unused imports (e.g., `Check`, `Loader2`) also failed strict linting.
**Learning:** In the Alchemistry React client, when using anchor tags for placeholder links, always use `href="#!"` instead of `href="#"` to prevent ESLint failures. Avoid using `role` as a prop name for custom components to prevent `jsx-a11y/aria-role` collisions; use alternatives like `roleType`. Always clean up unused imports to ensure CI lint steps pass.
