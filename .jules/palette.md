## 2025-04-30 - Fix generic invalid anchor links replacing with buttons
**Learning:** Found `<a href="#">` used as interactive elements without valid links in `AuthPage` and `LoginForm` creating a bad screen reader experience and triggering ESLint `jsx-a11y/anchor-is-valid`.
**Action:** Replace dummy links `<a href="#">` with `<button type="button" onClick={(e) => e.preventDefault()}>` to ensure accurate semantic HTML and accessibility.
