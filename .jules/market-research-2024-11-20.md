# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Virtual Science Education / EdTech
**Date:** 2024-11-20
**Competitors Researched:** Beyond Labz, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is mature, with established players focusing on high-fidelity simulations, gamification, and structured learning paths. While Alchemistry offers a strong core 3D simulation experience (organic, inorganic, titration), it lacks the structured educational scaffolding and assessment features that define top competitors. The biggest opportunities lie in adding guided experiment workflows, auto-graded quizzes, and printable lab reports to transition Alchemistry from a sandbox tool to a comprehensive educational platform.

## Competitor Analysis
*   **Beyond Labz:** Focuses on realistic, open-ended virtual labs. Key differentiators include an integrated "Lab Book" for recording data and observations, worksheets, and a "Lab Cam" for teachers to review student progress step-by-step.
*   **PraxiLabs:** Emphasizes gamification and AI assistance. Key differentiators include a 3D AI lab assistant, instant reporting/analytics, and gamified progress tracking.
*   **ChemCollective:** A free, accessible platform focusing on core chemistry concepts. Key differentiators include a wide variety of reagents, structured pre-lab activities, and auto-graded homework assignments.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   Structured lab manuals or guided experiment instructions (currently just "Select a module to begin").
*   Exportable lab reports (currently results are just shown on screen and saved to history, but not easily exportable as PDF/CSV).
*   In-experiment data recording (Lab Book equivalent).

### Differentiating Opportunities (Stand-out features)
*   Auto-graded quizzes/assessments tied to experiment results.
*   Gamification elements (badges, achievements) beyond a simple score.
*   Step-by-step experiment playback or "Lab Cam" feature.

### UX Patterns (Design/interaction patterns common in top products)
*   Contextual tooltips or a guided tour for first-time users.
*   Split-screen view: Experiment on one side, Lab Book/Instructions on the other.
*   Persistent, real-time feedback during the experiment (e.g., "Add more indicator").

## Prioritised Recommendations

### 1. Interactive Lab Manual / Guided Mode — Priority: HIGH | Effort: MEDIUM
**What:** Add a side panel in experiment modules (like Titration and Lab) that displays step-by-step instructions.
**Why:** Competitors like Beyond Labz and PraxiLabs provide structured guidance. Alchemistry currently relies on users knowing what to do.
**Where in code:** `client/src/pages/titration.jsx` and `client/src/pages/lab.jsx` (Add a `LabManual` component).
**How:** Create a stateful `LabManual` component that tracks the current step of the experiment and updates as the user completes actions (e.g., clicking "Add 10ml Acid").

### 2. Exportable Lab Reports (PDF/CSV) — Priority: HIGH | Effort: SMALL
**What:** Allow users to export their experiment results from the Result page or History page.
**Why:** A table-stakes feature for educational tools. Teachers need to see student work.
**Where in code:** `client/src/pages/result.jsx` and `client/src/pages/history.jsx`.
**How:** Add an "Export to PDF" button using a library like `jspdf` or simply an "Export to CSV" button that formats the `experiments` data from Supabase.

### 3. Integrated "Lab Book" for Data Recording — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow users to type notes and record observations during the experiment, rather than just seeing the final result.
**Why:** Mirrors the Beyond Labz "Lab Book" feature, promoting active learning.
**Where in code:** `client/src/pages/titration.jsx` (and other experiment pages).
**How:** Add a sliding "Lab Book" panel (using standard React state) with a `<textarea>` where users can write notes. Save these notes to the `experiment_results` table in Supabase.

### 4. Contextual Onboarding / Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Add a first-time user tour that highlights the controls (e.g., "Click here to add acid").
**Why:** Top competitors guide users through the complex UI.
**Where in code:** `client/src/pages/Dashboard.jsx` and experiment pages.
**How:** Implement a lightweight library like `react-joyride` or simple custom tooltips using a `localStorage` flag (`hasSeenTour`).

### 5. Gamification: Achievements/Badges — Priority: LOW | Effort: MEDIUM
**What:** Award badges for completing specific tasks (e.g., "First Perfect Titration", "Explosion Expert").
**Why:** PraxiLabs uses gamification to increase engagement.
**Where in code:** `client/src/pages/history.jsx` and the Supabase database.
**How:** Create a `badges` table in Supabase. Check conditions after an experiment (e.g., in `titration.jsx`'s `saveResult`) and unlock badges. Display them on the Dashboard or History page.

## Quick Wins (< 1 day each)
1.  **Exportable Lab Reports (CSV):** Easily achievable by converting the Supabase data array to CSV format and triggering a download.
2.  **Contextual Onboarding Tooltips:** Can be quickly added using a `localStorage` check and simple absolutely positioned div overlays.
3.  **Basic Lab Manual Panel:** A simple static text panel alongside the experiment can be added immediately to provide basic instructions.
