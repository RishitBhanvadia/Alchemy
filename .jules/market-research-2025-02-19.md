# Market Research Report
**App:** Alchemistry is a cutting-edge web-based virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive chemistry experiments.
**Market:** EdTech Virtual Labs / STEM Simulation Software
**Date:** 2025-02-19
**Competitors Researched:** Labster, Beyond Labz, ChemCollective, PraxiLabs

## Executive Summary
The EdTech virtual lab space is dominated by platforms that balance high-fidelity 3D simulations with strong pedagogical integration. While Alchemistry has an excellent modern UI (glassmorphism) and core interactive 3D physics (Three.js), it lacks the deeper learning workflow features present in top competitors. The most significant opportunities for Alchemistry involve bridging the gap between raw simulation (mixing chemicals) and structured learning (lab reports, procedural guidance, and assessments).

## Competitor Analysis
*   **Labster:** The market leader. Differentiates with highly gamified, story-driven scenarios and deep LMS integration. Extremely high-fidelity but resource-intensive.
*   **Beyond Labz:** Focuses on open-ended sandbox environments across multiple sciences. Very strong on realistic lab benches but older UI.
*   **ChemCollective:** Free, open-source project by CMU. Excellent pedagogical scenarios and virtual lab problems, but visually dated and 2D.
*   **PraxiLabs:** Growing player focusing on accessibility and detailed step-by-step guidance during experiments.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data/Lab Report Export:** Students need to submit results to their teachers or LMS.
*   **Procedural Worksheets:** Integrated instructions or lab manuals alongside the simulation.
*   **Pre/Post Lab Assessments:** Quizzes to test understanding before and after the experiment.

### Differentiating Opportunities (Stand-out features)
*   **AI-Guided Troubleshooting:** While Alchemistry has an `AiTutorPanel`, top tools use AI to specifically identify *why* a student's experiment failed based on their exact sequence of actions.
*   **Gamified Progression Tracking:** Visual skill trees or deeper achievement systems beyond basic badges.

### UX Patterns (Design/interaction patterns common in top products)
*   **Split-Screen Interface:** Lab manual/instructions on one side, 3D simulation on the other.
*   **Contextual Tooltips on First Use:** Highlighting interactable equipment.
*   **Experiment Notebook:** A persistent scratchpad for students to take notes during the simulation.

## Prioritised Recommendations

### 1. CSV Data Export for Lab Reports — Priority: HIGH | Effort: SMALL
**What:** Add a "Download Report (CSV)" button to the History page.
**Why:** Table stakes for any educational tool. Students need to prove they did the work and submit data to their LMS (Canvas, Google Classroom).
**Where in code:** `client/src/pages/history.jsx`
**How:** Map the `logs` from `useHistoryStore` to CSV format, create a Blob, and trigger a download.

### 2. Interactive Lab Notebook — Priority: HIGH | Effort: MEDIUM
**What:** A slide-out panel where students can type observations during an experiment.
**Why:** Science isn't just mixing; it's observing. Competitors like Beyond Labz heavily feature a persistent notebook.
**Where in code:** `client/src/pages/Lab3D.jsx` (New Component: `LabNotebookPanel`)
**How:** Create a Zustand store `notebookStore` to persist notes across sessions, and add a toggle button next to the AI Tutor and History buttons.

### 3. Step-by-Step Procedure Guide — Priority: MEDIUM | Effort: MEDIUM
**What:** A dismissible checklist of steps for specific assignments within the lab environment.
**Why:** Currently, students are dropped into a sandbox. PraxiLabs excels by providing structured guidance for specific curriculum goals.
**Where in code:** `client/src/pages/Lab3D.jsx` & `client/src/store/assignmentStore.js`
**How:** If a student enters the lab via an assignment, overlay a floating, collapsable `ProcedureList` component reading steps from the assignment data.

### 4. Contextual Equipment Tooltips (Onboarding) — Priority: MEDIUM | Effort: SMALL
**What:** "First-time" tooltips pointing out how to use the sliders and initiate reactions.
**Why:** Lowers the cognitive load for new users. Standard UX pattern in Labster.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `hasSeenTutorial` flag to localStorage. Use `react-joyride` or simple absolute positioned divs with Framer Motion to point to the chemical sliders and the "Initiate Reaction" button on first load.

### 5. Detailed Error Analysis from AI Tutor — Priority: MEDIUM | Effort: SMALL
**What:** Pass the current lab state (chemicals mixed) explicitly to the AI Tutor when a reaction fails.
**Why:** Alchemistry already has AI, but making it context-aware bridges the gap to premium competitors.
**Where in code:** `client/src/components/AiTutorPanel.jsx` & `client/src/pages/Lab3D.jsx`
**How:** When opening the AI panel after a failed reaction (`reactionState === 'error'`), prepopulate the AI context or initial prompt with the exact `chemA`, `chemB`, etc., values to get specific troubleshooting advice.

### 6. Classroom Leaderboard / Activity Feed — Priority: LOW | Effort: MEDIUM
**What:** Show anonymized or opted-in recent activity from classmates.
**Why:** Adds social proof and gamification, a growing trend in EdTech.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Fetch recent logs from `class_memberships` peers and display them in a scrolling ticker or sidebar widget.

### 7. Reset to Previous State (Undo) — Priority: LOW | Effort: SMALL
**What:** A button to revert chemical concentrations to their values *before* the last reaction.
**Why:** Reduces friction when iterating on an experiment.
**Where in code:** `client/src/store/labStore.js`
**How:** Save a `previousState` object before calling `initiateReaction`, and add an `undo()` action to the store.

### 8. Visual Safety Warnings — Priority: LOW | Effort: SMALL
**What:** Screen effects (e.g., subtle red vignette) or warning icons when mixing incompatible/dangerous chemicals.
**Why:** Reinforces lab safety protocols, a key selling point for virtual labs.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Evaluate `chemA` and `chemB` combinations in `useEffect`; if dangerous, trigger a Framer Motion animation on the overlay.

### 9. Shareable Experiment Links — Priority: LOW | Effort: MEDIUM
**What:** Allow students to share a specific experiment result configuration with a teacher or peer.
**Why:** Facilitates collaboration and easy grading.
**Where in code:** `client/src/pages/history.jsx`
**How:** Generate a unique query string (e.g., `?a=50&b=20`) and add a "Copy Link" button next to history items.

### 10. Granular Assessment Quizzes — Priority: LOW | Effort: LARGE
**What:** Post-experiment multiple-choice questions testing concepts learned.
**Why:** Direct competitor to Labster's integrated assessments.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Extend `ResultModal` to include an "Assessment" tab fetching questions relevant to the `reactionResult` from the backend.

## Quick Wins (< 1 day each)
1. **CSV Data Export:** (Recommendation #1) - Highly requested feature, implementable in ~50 lines of code in `history.jsx`.
2. **Contextual Onboarding:** (Recommendation #4) - Quick UI addition using localStorage to guide new students.
3. **Context-Aware AI Tutor:** (Recommendation #5) - Simple state passing to the existing AI component to make it instantly more useful.
