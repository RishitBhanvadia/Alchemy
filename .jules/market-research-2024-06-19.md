# Market Research Report
**App:** Alchemistry is a virtual chemistry laboratory enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Educational Technology (EdTech) / Virtual Laboratory Software
**Date:** 2024-06-19
**Competitors Researched:** Labster, PhET Interactive Simulations, Beyond Labz

## Executive Summary
The virtual chemistry lab market is dominated by tools that balance realistic 3D simulations with strong educational scaffolding. While Alchemistry has an impressive core 3D sandbox and basic teacher analytics, it currently lacks the structured onboarding, contextual guidance, and robust assessment tools found in market leaders. By adding guided learning pathways, in-app theory references, and more granular progress tracking, Alchemistry can evolve from a sandbox tool into a comprehensive educational platform.

## Competitor Analysis
*   **Labster:** The market leader, offering highly immersive, gamified 3D simulations. Differentiates with scenario-based learning (e.g., solving a crime using chemistry), embedded theory refreshers, and comprehensive LMS integration.
*   **PhET Interactive Simulations:** A widely accessible, free tool focused on intuitive, browser-based 2D/3D visualizations of concepts rather than ultra-realistic labs. Differentiates with ease of use and multilingual support.
*   **Beyond Labz:** Focuses deeply on specific chemistry domains (general and organic chemistry) with a high degree of simulation depth, often used as a direct replacement for physical labs.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Guided Onboarding:** Competitors guide new users through the interface and basic interactions. Alchemistry drops users into the 3D lab with minimal instruction.
*   **Contextual Theory:** Competitors provide accessible background theory before or during experiments. Alchemistry lacks an integrated way to review concepts like stoichiometry or acid-base theory within the lab.
*   **Formative Assessments:** Market leaders include quizzes or checks for understanding during the simulation.

### Differentiating Opportunities (Stand-out features)
*   **Scenario-Based Missions:** Framing experiments as real-world problems (e.g., "Analyze this water sample for contamination") rather than isolated tasks increases engagement.
*   **Exportable Reports:** Allowing students to export their lab history or specific experiment results as a PDF lab report for submission.

### UX Patterns (Design/interaction patterns common in top products)
*   **Interactive Tooltips/Overlays:** Providing contextual help when hovering over lab equipment or chemicals.
*   **Clear Progression Indicators:** Visual cues showing how much of a lab or module has been completed.

## Prioritised Recommendations

### 1. Interactive Lab Onboarding Tour — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step guided tour for first-time users in the `Lab3D` component, highlighting controls, chemical sliders, and the history panel.
**Why:** Essential for user retention. Currently, users might not know how to interact with the 3D environment or what the "Initiate Reaction" button requires.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `components/OnboardingTour.jsx`.
**How:** Use a library like `react-joyride` or build a custom overlay. Check a `hasSeenLabTour` flag in `localStorage` or user profile to trigger it automatically for new students.

### 2. Contextual Theory Panel — Priority: HIGH | Effort: SMALL
**What:** A slide-out panel or modal containing the theoretical background for the current experiment (e.g., explaining acid-base reactions).
**Why:** Prevents students from needing to leave the app to understand *why* a reaction happens, aligning with Labster's embedded theory features.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `components/TheoryPanel.jsx`.
**How:** Add a "Theory" toggle button (similar to the existing History or AI toggle) that opens a panel with hardcoded or database-fetched markdown content relevant to the selected chemicals.

### 3. Lab Report Export (PDF/CSV) — Priority: MEDIUM | Effort: SMALL
**What:** An "Export to CSV" or "Download PDF" button in the Student Dashboard or History page to export completed experiments.
**Why:** A table-stakes feature for educational tools, allowing students to submit proof of work to teachers outside the platform.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/StudentDashboard.jsx`.
**How:** Add an `ExportButton` component. For CSV, format the `logs` array from `useHistoryStore` and trigger a download using a Blob and object URL.

### 4. Scenario-Based Experiment Goals — Priority: MEDIUM | Effort: MEDIUM
**What:** Instead of just mixing chemicals, present users with a specific goal (e.g., "Neutralize this acid to a pH of 7").
**Why:** Increases engagement and pedagogical value, moving the app from a sandbox to a structured learning tool like Labster.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`.
**How:** Define an array of "Missions". Display the active mission in a UI banner. Update `reactionResult` logic to check if the outcome satisfies the mission conditions and award bonus XP.

### 5. Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Contextual hover tooltips on the 3D models (beaker, flask) or UI controls explaining their purpose.
**Why:** Reduces cognitive load and mimics the intuitive discovery patterns seen in PhET.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (if using `Html` from `@react-three/drei`) or `client/src/pages/Lab3D.jsx` for UI tooltips.
**How:** Implement simple `title` attributes or custom floating tooltip components that appear `onPointerOver` for 3D objects or `onMouseEnter` for UI elements.

## Quick Wins (< 1 day each)
1. **Lab Report Export:** Adding a simple CSV export to the `History` page is highly implementable using existing state.
2. **Contextual Theory Panel:** A static slide-out panel with basic chemistry definitions can be added quickly next to the AI Tutor button.
3. **Equipment Tooltips:** Adding native browser tooltips (`title` attributes) or simple CSS tooltips to the chemical sliders and action buttons.
