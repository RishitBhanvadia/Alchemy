## 2026-04-25 - Secure Random Code Generation
**Before:** `Math.random()` was being used to generate meeting and classroom codes, leading to predictable code generation vulnerabilities.
**Issue:** Using `Math.random()` for generating access codes is a security risk because it is not cryptographically secure.
**Learning:** Created a utility function `generateSecureCode(length)` in `server/utils/cryptoUtils.js` using Node.js's native `crypto.randomBytes()` for cryptographically secure random number generation, and replaced all instances of `Math.random()` code generators with it.

## 2026-04-25 - Fix React Custom Prop Names Conflict with ARIA Roles
**Before:** Custom React component `RoleCard` accepted a prop named `role` to specify the user role (student vs teacher). When passed down in `SignUpForm.jsx`, ESLint rule `jsx-a11y/aria-role` triggered an error: `Elements with ARIA roles must use a valid, non-abstract ARIA role` because it confused the custom prop `role` with the standard HTML ARIA `role` attribute.
**Issue:** Naming custom component props `role` conflicts with ESLint's accessibility rules, causing false positive lint errors when the prop value is not a valid standard HTML ARIA role.
**Learning:** Renamed the custom prop from `role` to `roleType` to avoid conflicting with the standard HTML `role` attribute and satisfy the `jsx-a11y/aria-role` ESLint rule.
