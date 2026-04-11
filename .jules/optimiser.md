## 2025-02-28 - Fix early return hook rules violation
**Bottleneck:** Build error (`The symbol "clicking" has already been declared`) and fatal React rendering crash due to hooks called conditionally.
**Impact:** Application builds successfully and prevents fatal rendering crashes.
**Learning:** Returning early before hooks (`if (isTouchDevice) return null;` followed by `useState`) causes React rendering issues and build failures. Move early returns *after* all hooks to strictly adhere to the Rules of Hooks.
