## 2024-05-24 - Fix Anchor Is Valid Errors in Auth Components
**Learning:** Found multiple instances where `<a href="#">` is used for terms of service or privacy policy placeholders. This violates accessibility guidelines (`jsx-a11y/anchor-is-valid`) as screen readers expect standard anchors to navigate somewhere.
**Action:** Replace placeholder `href="#"` with `href="#!"` or use `<button>` elements to prevent screen reader confusion and fix strict linting errors in React components.
