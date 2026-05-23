## 2025-05-23 - Fix accessibility violations in Auth pages
**Problem:** The Auth pages used dummy anchor tags (`<a href="#">`) for action buttons like "Terms of Service", "Privacy Policy", and "Forgot password?", which violates `jsx-a11y/anchor-is-valid` and impairs screen reader and keyboard accessibility.
**Context:** These are common interactive elements. For this app, ensuring strict accessibility compliance in primary entry points (like authentication) is critical for inclusive use.
**Solution:** Replaced all dummy anchor tags with `<button type="button">` elements, retaining their original styling while adding utility classes (`bg-transparent border-none p-0 cursor-pointer`) to preserve the link-like visual appearance and ensure robust accessibility.
