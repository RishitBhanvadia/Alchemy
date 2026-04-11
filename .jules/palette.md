## 2024-05-14 - Tooltips for icon-only buttons
**Learning:** Icon-only navigation buttons in the sidebar lacked accessible names (`aria-label`) and native hover tooltips (`title`), reducing usability for both screen readers and sighted users who may not recognize the icons immediately.
**Action:** Always add `aria-label` and `title` attributes to icon-only buttons (`<button><i className="fa-solid..." /></button>`) to provide context and improve accessibility and usability across the application.
