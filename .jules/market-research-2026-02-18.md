# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory for students.
**Market:** EdTech / Virtual Science Labs / STEM Education Tools.
**Date:** 2026-02-18
**Competitors Researched:** PhET Interactive Simulations, Labster, ChemCollective.

## Executive Summary
Alchemistry provides a solid visual foundation for virtual chemistry experiments with its 3D lab environment and titration simulation. However, it lags behind market leaders in educational scaffolding (onboarding, contextual feedback), accessibility (screen reader support), and data utility (exporting results). The biggest opportunity lies in transforming the app from a "simulator" to a "learning platform" by adding guided tutorials, exportable data for assessment, and robust accessibility features.

## Competitor Analysis

| Competitor | Key Strengths | Missing in Alchemistry |
| :--- | :--- | :--- |
| **PhET Interactive Simulations** | **Accessibility:** Industry-leading accessibility (Voicing, alternative input). **Interactivity:** Granular control (sliders, measurements). | comprehensive accessibility features (aria-live, keyboard nav), deep interactivity (measuring tools). |
| **Labster** | **Gamification:** Story-driven scenarios. **Immersion:** High-end 3D environments. | Narrative context, "Why am I doing this?" context. |
| **ChemCollective** | **Data/Analysis:** Focus on stoichiometry and calculations. | Detailed data analysis tools, structured lab reports. |

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
1.  **Guided Onboarding:** Competitors guide new users. Alchemistry drops them into the lab with zero instruction.
2.  **Data Export:** Students need to submit results. Alchemistry only shows a read-only history table.
3.  **Reset Capability:** In Titration, resetting requires a full page reload (`window.location.reload()`), which is jarring and clears all state.
4.  **Accessibility:** Critical for modern EdTech. Alchemistry lacks `aria-live` regions for dynamic content updates (e.g., titration color changes).

### Differentiating Opportunities (Stand-out features)
1.  **"Smart" Chemical Rack:** Hovering over chemicals could show real-time properties (Molar Mass, Density) to aid calculations, bridging the gap between theory and practice.
2.  **Visual Reaction Equation:** `Result.jsx` shows the equation *after* the fact. Showing a "predicted" equation or balancing tool *during* setup would be a unique learning aid.

### UX Patterns
1.  **Progressive Disclosure:** Complex tools (Titration) should reveal controls in stages (Setup -> Add Acid -> Add Indicator -> Titrate). Alchemistry dumps all controls at once (though some are disabled).
2.  **Live Feedback:** Tooltips or status bars that update *while* interactions happen (e.g., "Adding 1mL...").

## Prioritised Recommendations

### 1. Export History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the `History` page.
**Why:** Essential for students to submit lab work to teachers. Standard feature in all educational tools.
**Where in code:** `client/src/pages/history.jsx`
**How:**
-   Create a utility function `downloadCSV(data, filename)`.
-   Add a `<button>` in `History.jsx` header.
-   On click, convert `experiments` state to CSV format and trigger download.

### 2. Onboarding Tooltips — Priority: HIGH | Effort: MEDIUM
**What:** A "first-time user" tour overlay that highlights key areas (Chemical Rack, Test Tube, Start Button).
**Why:** New users are currently lost. Market research shows onboarding increases engagement significantly.
**Where in code:** `client/src/pages/lab.jsx`, `client/src/pages/titration.jsx`
**How:**
-   Create a `Tooltip` or `Tour` component.
-   Use `localStorage.getItem('hasSeenTour')` to check status.
-   If false, render the Tour component overlaying the UI.

### 3. "Try Again" / Reset Logic Refactor — Priority: MEDIUM | Effort: MEDIUM
**What:** Fix the "Reset Experiment" button in Titration to reset state instead of reloading the page.
**Why:** `window.location.reload()` is a bad UX pattern that clears browser cache/state and feels "broken".
**Where in code:** `client/src/pages/titration.jsx`
**How:**
-   Create a `resetState` function that sets all state variables (`count`, `shaking`, `chemA`, etc.) back to initial values.
-   Call this function instead of `window.location.reload()`.

### 4. Accessibility Live Regions — Priority: HIGH | Effort: SMALL
**What:** Add `aria-live="polite"` to status message areas.
**Why:** Screen readers currently miss dynamic updates (like "Titration Stopped" or "Color Changed").
**Where in code:** `client/src/pages/titration.jsx`, `client/src/pages/lab.jsx`
**How:**
-   Wrap the message/status `div`s with `<div role="status" aria-live="polite">`.
-   Ensure text content updates meaningfully.

### 5. Chemical Info Hover Cards — Priority: MEDIUM | Effort: SMALL
**What:** Show chemical properties when hovering over the chemical rack bottles.
**Why:** adds educational value and "discovery" element.
**Where in code:** `client/src/pages/lab.jsx`
**How:**
-   Create a `ChemicalCard` component (tooltip style).
-   Add `onMouseEnter`/`onMouseLeave` handlers to the chemical images.
-   Display data (MW, Density, Hazards).

### 6. Keyboard Navigation Fixes — Priority: MEDIUM | Effort: SMALL
**What:** Ensure the "MORE" dropdown in Navbar is accessible via keyboard.
**Why:** `onMouseEnter` is mouse-only.
**Where in code:** `client/src/components/Navbar.jsx`
**How:**
-   Add `onFocus` and `onBlur` handlers to the parent `div` or use a button trigger.
-   Ensure `dropdown-menu` links are reachable via Tab.

### 7. Responsive Layout Fixes (Titration) — Priority: MEDIUM | Effort: LARGE
**What:** Refactor Titration layout to use relative units (%) or Flexbox instead of hardcoded pixels.
**Why:** The current SVG/Absolute positioning breaks on mobile/tablet.
**Where in code:** `client/src/pages/titration.jsx`, `client/src/components/titration_setup.jsx`
**How:**
-   Replace `transform: translate(928px, 118px)` with CSS classes and media queries.
-   Use `viewBox` scaling for SVGs instead of fixed pixel dimensions.

### 8. Improved Error Handling — Priority: LOW | Effort: SMALL
**What:** Better error messages in `Result.jsx` when API fails.
**Why:** Currently logs to console or shows generic text.
**Where in code:** `client/src/pages/result.jsx`
**How:**
-   Add a user-friendly "Retry" button.
-   Show a friendly error illustration instead of just text.

### 9. Unit Testing for Calculations — Priority: MEDIUM | Effort: MEDIUM
**What:** Add unit tests for the titration scoring logic and reaction balancing.
**Why:** Critical logic is currently untested.
**Where in code:** `client/src/utils/titrationUtils.js` (create if missing), `client/src/tests/`
**How:**
-   Extract logic from `Titration.jsx` into a utility.
-   Write Vitest tests to verify scoring accuracy (100 - diff).

### 10. Skeleton Loading States — Priority: LOW | Effort: SMALL
**What:** Replace the "Loading..." text/spinner with skeleton UI in History.
**Why:** Perceived performance improvement.
**Where in code:** `client/src/pages/history.jsx`
**How:**
-   Create a `SkeletonRow` component.
-   Render it 5 times while `loading` is true.

## Quick Wins (< 1 day each)
1.  **Export History to CSV:** Copy-paste utility function, add button. (Est: 2 hours)
2.  **Accessibility Live Regions:** Add 2 attributes to existing divs. (Est: 30 mins)
3.  **Keyboard Nav Fixes:** Update `Navbar.jsx` event handlers. (Est: 1 hour)
