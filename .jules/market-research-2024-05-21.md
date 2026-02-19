# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory for students.
**Market:** EdTech / Virtual Science Labs
**Date:** 2024-05-21
**Competitors Researched:** PhET Interactive Simulations, Labster, ChemCollective, PraxiLabs

## Executive Summary
Alchemistry enters the crowded EdTech market with a modern, glassmorphism-based UI, positioning itself between the highly accessible, physics-accurate simulations of PhET and the immersive, gamified environments of Labster. While the visual aesthetic is strong, the application suffers from critical usability gaps—specifically the reliance on external "lab manuals" (e.g., "Refer to Page 70") and a lack of procedural scaffolding. The biggest opportunity lies in integrating these instructions directly into the interface and enhancing data export capabilities to make it a viable tool for classroom submission.

## Competitor Analysis

| Competitor | Key Differentiators | Weaknesses |
| :--- | :--- | :--- |
| **PhET** | Industry standard for accuracy, accessibility, and free access. Highly interactive. | UI can feel dated. Focus is on concepts, not "lab procedure." |
| **Labster** | High-end 3D graphics, narrative-driven, gamified learning. | Expensive, requires high bandwidth/hardware. |
| **ChemCollective** | Strong focus on stoichiometry and quantitative mixing. | UI is functional but not modern. |
| **PraxiLabs** | Good balance of 3D and procedure. Covers wide range of experiments. | User experience can be clunky. |

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
1.  **In-App Instructions:** Competitors guide users through steps (e.g., "Add 5mL of HCl"). Alchemistry relies on external knowledge or physical manuals ("Refer Your Chemistry Lab Manual Page - 70").
2.  **Data Export:** Students need to submit results. Competitors allow saving/printing reports. Alchemistry only shows a history table.
3.  **Onboarding/Tooltips:** No guidance on how to use the custom UI controls (e.g., the titration "shake" or "drop" mechanics).

### Differentiating Opportunities (Stand-out features)
1.  **Modern Aesthetic:** The "Neon/Glass" look is unique in a market dominated by clinical or cartoony styles.
2.  **Gamification:** The scoring system in Titration is a good start. Adding badges, streaks, or leaderboards would increase engagement.

### UX Patterns
1.  **Step Progress Indicators:** Competitors visually show progress (Step 1/5). Alchemistry is opaque about how far along the user is.
2.  **Feedback Loops:** Visual or audio cues when a reaction reaches a critical point (endpoint).

## Prioritised Recommendations

### 1. In-App Lab Manual / Instruction Panel — Priority: HIGH | Effort: MEDIUM
**What:** Replace "Refer Your Chemistry Lab Manual Page - 70" with a collapsible side panel or modal containing the step-by-step procedure.
**Why:** Users cannot perform the experiment without external material. This is a critical usability blocker.
**Where in code:** `client/src/pages/organic.jsx`, `client/src/pages/titration.jsx`
**How:** Create a `LabManual` component that takes `steps` as a prop. Render it in the `experiment-panel` or as a floating modal.

### 2. Data Export (CSV/PDF) — Priority: HIGH | Effort: SMALL
**What:** Add a "Download Report" button to the History page.
**Why:** Essential for students to submit work to teachers. Standard feature in all competitors.
**Where in code:** `client/src/pages/history.jsx`
**How:** Use a library like `papaparse` or simple JS to convert the `experiments` state to CSV and trigger a download.

### 3. Step Progress Indicator — Priority: MEDIUM | Effort: SMALL
**What:** Add a visual stepper (e.g., "Setup -> Titration -> Result") to the experiment pages.
**Why:** Reduces cognitive load by showing users where they are in the process.
**Where in code:** `client/src/components/TitrationProgress.jsx` (New Component), insert into `titration.jsx`.
**How:** Create a simple component mapping current state (e.g., `confirm`, `add_acid`, `drop`) to a progress bar.

### 4. Accessibility Improvements (Aria Labels) — Priority: MEDIUM | Effort: SMALL
**What:** Add `aria-label` and keyboard support to the custom SVG controls.
**Why:** The `Titration` page relies heavily on mouse interaction and visual cues, excluding screen reader users.
**Where in code:** `client/src/pages/titration.jsx`, `client/src/components/titration_setup.jsx`
**How:** Add `role="button"`, `tabIndex="0"`, and `aria-label` to the interactive `div`/`svg` elements.

### 5. Gamification (Badges/Streaks) — Priority: LOW | Effort: MEDIUM
**What:** Award badges for "Perfect Score" or "3 Days in a Row".
**Why:** Increases student engagement and replayability.
**Where in code:** `client/src/pages/titration.jsx` (logic), `client/src/pages/dashboard.jsx` (display).
**How:** Update `saveResult` to check for achievements and store them in a new `achievements` table or column.

## Quick Wins (< 1 day each)
1.  **Fix "Page 70" Text:** Update `client/src/pages/organic.jsx` to at least list the groups (0-6) directly in the UI instead of referencing a book.
2.  **CSV Export:** Implement the download button in `History.jsx`.
3.  **Tooltip for "Shake":** Add a simple tooltip or help text explaining how to use the shake feature in Titration.
