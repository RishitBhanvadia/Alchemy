# Market Research Report
**App:** Alchemistry - Virtual Chemistry Laboratory
**Market:** EdTech / Virtual Science Labs
**Date:** 2024-05-23
**Competitors Researched:** Labster, PraxiLabs, ChemCollective, PhET Interactive Simulations

## Executive Summary
Alchemistry is a solid foundation for a virtual chemistry lab, featuring 3D visualization and basic reaction logic. However, it functions more as a sandbox than a structured educational tool. Compared to market leaders like Labster (immersive narratives) and ChemCollective (scenario-based learning), Alchemistry lacks guided inquiry, assessment depth, and critical "table stakes" features like data persistence for all experiment types and lab safety protocols. The biggest opportunity is to transform it from a "chemical mixer" into a "guided learning platform" by adding instructional overlays, unified history tracking, and safety simulations.

## Competitor Analysis
*   **Labster:** High-fidelity 3D, gamified narratives, heavy emphasis on safety and "why" we do experiments. Very expensive.
*   **PraxiLabs:** Focuses on accessibility and language support, with clear step-by-step guides.
*   **ChemCollective:** Lower fidelity but high academic rigor. scenario-based (e.g., "Solve the murder using chemistry").
*   **PhET:** Very simple, 2D, highly interactive, focuses on concept isolation (e.g., "See the molecules").

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
1.  **Unified Experiment History:** Users expect *all* their work to be saved. Currently, `Lab` results are only in `localStorage` and disappear, while `Titration` saves to the database.
2.  **Lab Safety Protocols:** A virtual lab for students *must* teach safety (goggles, gloves). This is standard in all competitor apps to reinforce real-world habits.
3.  **Exportable Data:** Students need to submit evidence of their work (PDF/CSV) to teachers.

### Differentiating Opportunities
1.  **"Quick-Mix" Sandbox:** Most competitors lock you into a long scenario. Alchemistry's fast, open-ended mixing is a strength if paired with better feedback.
2.  **Lightweight 3D:** Runs in the browser without heavy downloads (unlike Labster), making it accessible on lower-end devices.

### UX Patterns
*   **Guided Onboarding:** "Click here to pick up the beaker" tooltips.
*   **Contextual Feedback:** Real-time warnings (e.g., "Careful, that's acidic!").

## Prioritised Recommendations

### 1. Unified Data Persistence — Priority: CRITICAL | Effort: MEDIUM
**What:** Save `Lab` results to the Supabase `experiment_results` table.
**Why:** Currently, the `History` page is broken for the main Lab module. Users lose data upon logout.
**Where in code:** `client/src/pages/result.jsx` (add Supabase insert logic similar to `Titration.jsx`).
**How:** Import `supabaseClient`, use `insert` on `experiment_results` with `chemA/B/C/D` data when the result loads.

### 2. Guided Inquiry Mode (Onboarding) — Priority: HIGH | Effort: MEDIUM
**What:** Add an optional "Goal" or "Mission" overlay (e.g., "Create a generic salt").
**Why:** Students don't know *what* to mix. Competitors provide structure.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** Add a `MissionModal` component that sets a target chemical state. Display hints if the user struggles.

### 3. Lab Safety Check ("Goggles On") — Priority: HIGH | Effort: SMALL
**What:** A modal before the experiment starts requiring the user to "Put on Safety Goggles".
**Why:** Educational best practice. Differentiates "game" from "lab simulation".
**Where in code:** `client/src/pages/lab.jsx` or a new `LabEntry.jsx` wrapper.
**How:** Simple state `hasPPE` (bool). If false, show a modal with a "Wear Goggles" button that toggles the state.

### 4. Export Results to CSV/PDF — Priority: MEDIUM | Effort: SMALL
**What:** A "Download Report" button on the Result and History pages.
**Why:** Essential for homework submission.
**Where in code:** `client/src/pages/result.jsx` and `client/src/pages/history.jsx`.
**How:** Use a simple function to convert the JSON data to a CSV string and trigger a browser download.

### 5. Accessibility: Texture/Label Support — Priority: MEDIUM | Effort: MEDIUM
**What:** Add text labels or patterns to the liquid visualization in the test tube.
**Why:** The current app relies 100% on color to distinguish chemicals, which fails accessibility standards (WCAG).
**Where in code:** `client/src/components/testtube.jsx`.
**How:** Add an SVG pattern overlay or a floating label next to the liquid levels.

### 6. "Why it Happened" Explainer — Priority: MEDIUM | Effort: MEDIUM
**What:** Expand the result feedback to explain the reaction mechanism, not just the product name.
**Why:** Enhances educational value.
**Where in code:** `client/src/pages/result.jsx`.
**How:** The backend already returns `product_info`. Display this more prominently, perhaps with a molecular diagram (static image).

### 7. Chemical Library Expansion — Priority: LOW | Effort: LARGE
**What:** Move hardcoded chemicals (HCl, NaCl, etc.) to a database config.
**Why:** Allows easy addition of new experiments without code changes.
**Where in code:** `client/src/pages/lab.jsx` (state) and `server/controllers/resultController.js` (logic).
**How:** Refactor `chemA`, `chemB` etc. to an array of objects fetched from Supabase.

## Quick Wins (< 1 day each)
1.  **Fix History Saving:** Copy the Supabase logic from `Titration.jsx` to `Result.jsx`.
2.  **Safety Modal:** Add a simple "Alert" or custom modal on page load in `Lab.jsx`.
3.  **Export Button:** Add a basic CSV export to `History.jsx`.
