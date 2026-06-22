# Market Research Report
**App:** A web-based virtual chemistry laboratory using 3D simulations (React + Three.js) for safe, interactive experiments with teacher/student dashboards and assignment tracking.
**Market:** Virtual Science Laboratory Software / EdTech
**Date:** 2024-06-22
**Competitors Researched:** Labster, PhET Interactive Simulations, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market focuses heavily on bridging theory and practice. While open sandboxes are engaging, schools demand structured learning, assessment, and accessibility. Alchemistry has a strong 3D foundation and teacher/student roles, but lacks the structured guidance, data logging, and accessibility features that top competitors use to drive adoption. Enhancing the lab with guided workflows and better data capture will significantly increase its value to educators.

## Competitor Analysis
*   **Labster:** The market leader in high-fidelity 3D labs. Key differentiators: Gamified storytelling, strict step-by-step guidance, integrated multiple-choice quizzes, and built-in theory pages.
*   **PraxiLabs:** Focuses on realistic, immersive environments. Key differentiators: Dual language support (English/Arabic), step-by-step procedures, and AI assistance for lab procedures.
*   **PhET Interactive Simulations:** Free, widely used 2D simulations. Key differentiators: Extremely accessible, focuses on concept visualization over realistic procedures, highly exploratory.
*   **ChemCollective:** Older, but popular for its pedagogical value. Key differentiators: Focuses heavily on the math and calculation aspects of chemistry, providing an integrated workspace for solving problems.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Guided Experiment Mode:** Step-by-step instructions overlaid on the 3D lab. Currently, Alchemistry only offers an open sandbox with an AI tutor.
*   **Integrated Lab Notebook:** A place for students to record observations and data during the experiment, rather than just seeing a final result modal.
*   **In-Lab Theory Reference:** Easy access to the chemical equations and safety data relevant to the current experiment without leaving the lab screen.

### Differentiating Opportunities (Stand-out features)
*   **Post-Lab Assessment:** Automatically generating a short quiz based on the experiment's outcome to validate understanding before logging the history.
*   **Visual Data Graphing:** Automatically plotting concentration changes over time (e.g., in a titration) directly in the lab interface.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips:** Explaining the function of each chemical or tool on hover/first use.
*   **Split-Screen Interface:** Having the 3D environment on one side and instructions/notebook on the other, rather than overlays that obscure the view.
*   **Reset/Undo Actions:** Allowing students to easily restart a specific step without resetting the entire simulation.

## Prioritised Recommendations

### 1. Guided Experiment Mode Toggle — Priority: HIGH | Effort: MEDIUM
**What:** Add a "Guided Mode" toggle in the 3D lab that overlays step-by-step instructions (e.g., "Set HCl to 50%", "Add Indicator").
**Why:** Teachers need structured activities, not just sandboxes. Competitors like Labster rely entirely on this.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a `GuidedModeOverlay` component and state).
**How:** Create an array of instruction steps. Use the existing chemical state (`chemA`, `chemB`) to automatically advance to the next step when the student sets the correct values.

### 2. Integrated Digital Lab Notebook — Priority: HIGH | Effort: MEDIUM
**What:** A slide-out panel where students can type observations and view auto-logged data (chemical % used, reaction outcome).
**Why:** Scientific method requires recording data. Competitors feature notebooks heavily.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `components/LabNotebook.jsx`.
**How:** Add a floating button to toggle the notebook panel. Save notebook contents to the `useHistoryStore` when the experiment concludes.

### 3. Theory & Safety Data Reference Panel — Priority: MEDIUM | Effort: SMALL
**What:** A small modal or sidebar tab displaying chemical properties, hazards, and the balanced equation for the selected reaction.
**Why:** Connects the 3D visual to textbook knowledge without leaving the lab.
**Where in code:** `client/src/pages/Lab3D.jsx` (beside the AI Tutor button).
**How:** Create a simple informational component that updates based on the currently selected `experiment_type` or chemical sliders.

### 4. Post-Experiment Mini-Quiz — Priority: MEDIUM | Effort: LARGE
**What:** A brief (1-3 question) quiz presented in the `ResultModal` before the result is saved to history.
**Why:** Validates learning and provides actionable data for the Teacher Dashboard.
**Where in code:** `client/src/components/ResultModal.jsx` (assuming it exists based on `Lab3D.jsx` imports).
**How:** Extend the result modal to show questions based on the outcome. Pass the quiz score to the history logging function.

### 5. Contextual Tooltips for Controls — Priority: MEDIUM | Effort: SMALL
**What:** Hover tooltips on the chemical sliders and the "Initiate Reaction" button explaining what they do.
**Why:** Reduces cognitive load for new users. Standard UX pattern in complex simulations.
**Where in code:** `client/src/pages/Lab3D.jsx` (within the `slider-card` elements).
**How:** Add standard `title` attributes or a lightweight tooltip library to the slider controls and labels.

### 6. Real-time Reaction Graphing — Priority: LOW | Effort: LARGE
**What:** A dynamic line graph showing the simulated concentration of products forming over time while the reaction is "loading".
**Why:** Enhances the scientific feel and provides visual feedback during the loading state.
**Where in code:** `client/src/pages/Lab3D.jsx` (during the `reactionState === 'loading'` phase).
**How:** Use a charting library (like Recharts) to render a mock reaction kinetics curve that animates over the duration of the loading state.

### 7. Explicit "Reset Lab" Button — Priority: LOW | Effort: SMALL
**What:** A clear, always-visible button to reset all chemical sliders to 0 and clear the current state.
**Why:** Users currently might have to manually slide everything back to 0 or refresh the page to start over cleanly.
**Where in code:** `client/src/pages/Lab3D.jsx` (near the lab controls).
**How:** Add a button that calls `setChemA(0)`, `setChemB(0)`, etc., and sets `reactionState` to 'idle'.

### 8. Export History to CSV/PDF — Priority: LOW | Effort: MEDIUM
**What:** Allow students and teachers to download experiment history or analytics.
**Why:** Schools often require offline documentation of completed work.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `TeacherDashboard.jsx`.
**How:** Use Papa Parse for CSV export or a simple print stylesheet for PDF export of the history/analytics tables.

## Quick Wins (< 1 day each)
1.  **Explicit "Reset Lab" Button:** Easily added to the control panel in `Lab3D.jsx`.
2.  **Contextual Tooltips:** Add `title` tags to all major UI elements in the lab.
3.  **Theory & Safety Data Reference:** Hardcode basic info for the main chemicals and display in a simple modal toggled from the lab screen.
