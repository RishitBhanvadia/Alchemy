# Market Research Report
**App:** Alchemistry is a virtual 3D chemistry laboratory web application built with React and Three.js for students and teachers to safely simulate chemical reactions.
**Market:** EdTech Virtual Science Simulation Software (K-12 & Higher Ed)
**Date:** 2026-06-08
**Competitors Researched:** Labster, Futuclass, PraxiLabs, EduInterface Chemist

## Executive Summary
The virtual chemistry simulation market is shifting from static simulations to highly interactive, game-like experiences. Top competitors focus on safety, gamification, and robust assessment tools. Alchemistry already has a modern 3D physics-based lab and basic assignments, but lacks critical features for true classroom integration, such as printable lab reports/data export, interactive in-lab tutorials (onboarding), and deeper accessibility compliance for diverse learners. Adding a simple CSV export for lab history and contextual tooltips would significantly elevate the product's viability in a real educational setting.

## Competitor Analysis
*   **Labster:** The market leader. Offers comprehensive, story-driven simulations with robust learning management system (LMS) integrations, assessment tools, and data export. Focuses heavily on realism and pedagogical structure.
*   **PraxiLabs:** Focuses on accessibility and affordability for higher education. Offers a wide range of experiments with built-in theory, lab manuals, and post-lab quizzes. Known for 3D realism.
*   **Futuclass:** Targets middle/high school with highly gamified, short VR/PC modules. Focuses on engagement through puzzles and immediate feedback rather than deep, open-ended experimentation.
*   **Chemist (EduInterface):** A more traditional virtual lab allowing freeform mixing with safety features (no broken glass). Focuses on visual reactions and basic data collection.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export (Lab Reports):** Students need to export their experiment logs (history) as CSV or PDF to submit for grading or include in lab reports.
*   **Interactive Onboarding:** A guided tour or contextual tooltips for first-time users in the 3D lab to explain controls (e.g., "Drag chemicals here").
*   **Integrated Assessments:** In-lab quizzes or theory questions before/during an experiment.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Achievement System:** Badges or points for discovering specific reactions (beyond the current Success Celebration).
*   **Real-time Collaboration:** Allowing multiple students to be in the same 3D lab session.

### UX Patterns (Design/interaction patterns common in top products)
*   **Persistent Safety Reminders:** Visual cues for PPE (Personal Protective Equipment) usage.
*   **Export/Print Buttons:** Prominent buttons on history/results pages for easy data extraction.

## Prioritised Recommendations

### 1. Export History to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the History page to export the experiment logs.
**Why:** Teachers require documented proof of experiments, and students need data for lab reports. This is a table-stakes feature in EdTech tools like Labster.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a button that triggers a function to convert the `logs` array in `useHistoryStore` to CSV format and trigger a file download using standard browser APIs.

### 2. Interactive First-Time Tutorial — Priority: HIGH | Effort: MEDIUM
**What:** Add a lightweight onboarding overlay for the 3D lab explaining the drag-and-drop physics and sliders.
**Why:** First-time users often struggle with 3D controls. Futuclass and Labster both heavily utilize guided tutorials.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use `localStorage` to check if a `hasSeenTutorial` flag exists. If not, show a series of tooltips pointing to the chemical sliders and the canvas.

### 3. "Reaction Discovered" Badges — Priority: MEDIUM | Effort: SMALL
**What:** Add a badge system for finding new reactions, visible in the Student Dashboard.
**Why:** Gamification drives engagement. Futuclass uses this to make chemistry feel like a puzzle.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/store/historyStore.js`
**How:** Derive unique `outcome_label`s from the user's history logs and display them as "Unlocked Reactions" on the dashboard.

### 4. Detailed Safety Warnings on Results — Priority: MEDIUM | Effort: SMALL
**What:** Expand the current warning system to include specific safety handling instructions (e.g., "Requires Fume Hood").
**Why:** Simulating real lab safety is a key selling point for products like EduInterface Chemist.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Map the `is_dangerous` flag to specific predefined safety tips in the modal.

### 5. Quick Print View for Results — Priority: LOW | Effort: SMALL
**What:** Add a print-friendly stylesheet and button to the Result page.
**Why:** Alternative to CSV for physical classroom submissions.
**Where in code:** `client/src/pages/result.jsx` and `client/src/pages/result.css`
**How:** Add `@media print` CSS rules and a `window.print()` button.

## Quick Wins (< 1 day each)
1. Add "Export CSV" to `history.jsx`.
2. Implement `@media print` in `result.css`.
3. Add a "Reactions Discovered" counter to `StudentDashboard.jsx` based on history length.
