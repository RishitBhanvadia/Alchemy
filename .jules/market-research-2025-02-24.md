# Market Research Report
**App:** A virtual chemistry laboratory enabling students to safely conduct interactive 3D chemistry experiments online.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2025-02-24
**Competitors Researched:** Labster, ChemCollective, Late Nite Labs

## Executive Summary
The virtual chemistry lab market focuses heavily on bridging the gap between theoretical knowledge and practical application. Top competitors differentiate themselves through realistic simulations, guided onboarding, and comprehensive lab reporting. For Alchemistry, there are significant opportunities to enhance the existing 3D environment with basic table stakes features like exportable lab reports, contextual tooltips, and more quantitative measurement tools, all of which map cleanly to the current codebase architecture.

## Competitor Analysis
*   **Labster:** The market leader. Known for gamified, immersive 3D simulations with deep scenario-based learning. Differentiates heavily on contextual guidance ("theory refreshers") and comprehensive dashboard analytics for instructors.
*   **ChemCollective:** A well-established, more traditional 2D virtual lab. Strengths lie in its robust handling of quantitative chemistry (molarity, precise volume measurements) and a massive repository of community-created homework assignments.
*   **Late Nite Labs (Macmillan Learning):** Offers a very realistic, open-ended sandbox environment combined with structured lab manuals and assignment tracking.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Exportable Lab Reports:** Students need to save and submit their work.
*   **First-Time User Onboarding:** Immediate contextual help upon entering the 3D lab environment for the first time.
*   **Precise Quantitative Controls:** Current controls use percentage sliders; chemistry requires precise volume/molarity inputs.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Achievements/Badges:** Rewarding students for discovering specific reactions or maintaining safety streaks.
*   **"Theory Refreshers":** In-context modals explaining the chemical principles behind the active reaction.

### UX Patterns (Design/interaction patterns common in top products)
*   **Persistent Inventory/Stockroom Explorer:** A constant visual sidebar or dock showing available reagents and glassware.
*   **Contextual Tooltips:** Hovering over instruments/chemicals reveals their exact properties and current state.

## Prioritised Recommendations

### 1. Exportable Experiment History (CSV) — Priority: HIGH | Effort: SMALL
**What:** Allow students to export their experiment history (`/history`) to a CSV file.
**Why:** Table stakes for educational tools. Students need to submit lab reports or analyze data externally.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component. Since `history.jsx` already fetches and maps `logs` from `useHistoryStore`, map the existing `logs` array to CSV string format and trigger a file download using a Blob. (~30 lines).

### 2. Contextual First-Time Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** A guided tooltip overlay when a user first enters the 3D lab.
**Why:** Top competitors (Labster) heavily guide users. The 3D interface (`Lab3D.jsx`) has a steep learning curve.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `hasSeenLabIntro` flag to `localStorage`. If false, render a step-by-step tooltip overlay component that highlights the Chemical Level Indicators and "INITIATE REACTION" button.

### 3. "Theory Refresher" on Reaction Result — Priority: MEDIUM | Effort: SMALL
**What:** Expand the `ResultModal` to include an explanation of *why* the reaction happened.
**Why:** Connects the simulation back to theoretical learning, a core feature of competitors.
**Where in code:** `client/src/components/ResultModal.jsx` and backend `server/controllers/experimentController.js`.
**How:** Add a `theory_explanation` field to the `reactionResult` object returned by the backend. Display this text in a new section within `ResultModal.jsx`.

### 4. Quantitative Input Mode Toggle — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow users to switch from percentage sliders to precise numeric inputs (e.g., 5.0 mL, 0.1 M).
**Why:** ChemCollective excels because it allows precise calculations. Percentages are too abstract for advanced chemistry.
**Where in code:** `client/src/pages/Lab3D.jsx` (specifically the `.lab3d-controls-container`).
**How:** Add a toggle state (`isQuantitativeMode`). When true, replace the `<input type="range">` with numeric `<input type="number">` fields for `chemA`, `chemB`, etc., keeping the existing state hooks.

### 5. Persistent "Stockroom" UI — Priority: LOW | Effort: LARGE
**What:** A sidebar listing all unlocked chemicals, rather than fixed sliders.
**Why:** Mirrors the standard UX pattern of virtual labs (ChemCollective, Late Nite Labs).
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Refactor the controls container into a draggable/scrollable inventory list. This requires more significant UI restructuring but builds on the existing `lockedChems` prop.

## Quick Wins (< 1 day each)
1. **Exportable Experiment History (CSV):** Easily achievable by mapping the existing `logs` state in `history.jsx`.
2. **First-Time User Onboarding:** A simple `localStorage` check and tooltip overlay in `Lab3D.jsx`.
3. **"Theory Refresher" Modal Addition:** Minor addition to the existing `ResultModal` UI.
