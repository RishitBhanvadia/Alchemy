## 2026-04-05 - Auth Tests & Accessibility
**Gap:** The critical user authentication flow for registration (`SignUpForm`) was completely untested, leading to zero coverage for form validation, successful signups, and error handling.
**Learning:** React Testing Library's `getByLabelText` relies explicitly on `htmlFor` attributes on custom input components. The `SignUpForm` tests initially failed or would fail without the fix because the `<label>` inside `InputField.jsx` lacked an explicit connection to its input.
**Pattern:** For custom form components like `InputField`, always pass the `name` or `id` prop down and strictly assign it to the label's `htmlFor` attribute. When testing, mock the router (if needed), dependencies like `supabaseClient` and UI toast libraries to cleanly isolate component logic.

## 2026-04-05 - Safe Anchors in Tests
**Gap:** Components utilizing standard `<a href="#">` or `<a href="#!">` for buttons triggered `jsx-a11y/anchor-is-valid` linting errors, breaking CI.
**Learning:** These errors aren't just aesthetic; React Testing Library struggles interacting with dead links as buttons, and clicking them during test runs can trigger unwanted navigation events or page reloads in `jsdom`.
**Pattern:** For non-navigating, interactive "links" (like "Forgot password?" or "Terms of Service"), consistently replace them with `<button type="button">` styled as text to eliminate React/Vitest testing side-effects and pass accessibility constraints.
