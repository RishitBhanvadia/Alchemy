## 2024-05-26 - Refactor dummy links to buttons
**Before:** `<a href="#" className="text-lab-cyan hover:text-lab-cyan/80 transition-colors">Terms of Service</a>`
**Issue:** `jsx-a11y/anchor-is-valid` lint errors because of dummy links (`href="#"`).
**Learning:** Replace anchor tags with `<button type="button">` element while retaining the original CSS utility classes to maintain its appearance.
