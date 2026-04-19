## YYYY-MM-DD - Refactoring Duplicate Code in Pages

**Before:** `organic.jsx` and `inorganic.jsx` have identical code for saving results to Supabase (checkAns) and trigger animations (send_info).
**Issue:** The duplication leads to maintenance burden. Adding another type of chemistry or changing how answers are saved would require updating multiple files.
**Learning:** Extracting common API interactions and animation states into shared custom hooks simplifies React components and improves reusability.
## 2025-04-19 - Extracted duplicate checkAns and send_info to useExperimentTest

**Before:** Both `organic.jsx` and `inorganic.jsx` contained nearly identical `send_info` and `checkAns` functions which handle visual delays, Supabase interactions, and form states.
**Issue:** Having duplicated logic meant making changes to how experiments are logged would require touching multiple UI files, creating a maintenance burden.
**Learning:** Extracting common UI animation delays and complex database interaction logic into custom React hooks (`useExperimentTest`) keeps the UI components focused strictly on presentation, vastly improving code clarity and ensuring consistency across different lab experiment pages.
