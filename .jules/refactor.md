## 2026-06-24 - Replaced a tags with buttons for a11y
**Before:** <a href="#" ...>
**Issue:** The href attribute requires a valid value to be accessible. Failing this violates jsx-a11y/anchor-is-valid.
**Learning:** Replace invalid anchor tags with <button type="button"> styled as links.
