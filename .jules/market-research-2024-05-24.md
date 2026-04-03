# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory for students and teachers to conduct safe, interactive chemistry experiments.
**Market:** Educational Technology (EdTech) - STEM Virtual Simulations
**Date:** 2024-05-24
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

## Executive Summary
The virtual chemistry laboratory market is driven by immersive 3D simulations, safety, and accessibility. Top competitors provide robust tools that not only simulate reactions but also guide students through proper lab procedures and assessments. For Alchemistry, the largest opportunities lie in moving beyond a pure sandbox into a guided learning environment, specifically by adding integrated quizzes, step-by-step lab manuals within the 3D space, and in-experiment data recording.

## Competitor Analysis
- **Labster:** Market leader focusing on gamified, narrative-driven simulations. Key differentiators include built-in quiz questions, detailed story contexts, and comprehensive safety training.
- **PraxiLabs:** Focuses on realistic 3D environments with strong accessibility features (bilingual, LMS integration, offline capable). Features "Oxi" a virtual partner, skip-ahead options, and extensive experiment varieties.
- **Beyond Labz:** Emphasizes open-ended, realistic experimentation. Key features include a virtual lab notebook where students record data, titration setups, and a highly interactive "lab bench" feel.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Pre and Post-Lab Assessments (Quizzes linked directly to experiments).
- In-experiment step-by-step guidance (Lab Manual overlay).

### Differentiating Opportunities (Stand-out features)
- In-experiment Data Recording / Virtual Lab Notebook.
- Expandable Chemical Shelf (Dynamic chemical selection rather than hardcoded).

### UX Patterns (Design/interaction patterns common in top products)
- Virtual Assistant guidance during the flow.
- Accessibility overlays and settings.

## Prioritised Recommendations

### 1. Integrated Experiment Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Add pre and post-lab quiz questions that must be answered before/after an assignment.
**Why:** Competitors like Labster heavily rely on quizzes to ensure learning retention rather than just clicking through a simulation.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/StudentDashboard.jsx` (linking to a new Quiz component).
**How:** Create a `QuizModal` component that triggers before the `Lab3D` canvas loads, and another that triggers after the `ResultModal` is closed, saving scores to Supabase.

### 2. In-Experiment Lab Notebook — Priority: HIGH | Effort: MEDIUM
**What:** A floating panel where students can type observations and log data points during the reaction.
**Why:** Beyond Labz uses this to simulate real scientific process. Currently, Alchemistry auto-logs outcomes but doesn't capture student hypotheses or manual notes.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a new toggle alongside the AI Tutor toggle).
**How:** Create a `LabNotebook` component with a text area. Save notes to the `experiment_logs` table by updating the `initiateReaction` payload in `client/src/store/labStore.js`.

### 3. Step-by-Step Lab Manual Overlay — Priority: HIGH | Effort: SMALL
**What:** A sidebar or overlay showing the expected procedure steps for the current assignment.
**Why:** Prevents the "blank canvas" problem. PraxiLabs uses walkthroughs and manuals effectively.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Render a checklist based on the active assignment fetched from `useAssignmentStore`.

### 4. Dynamic Chemical Shelf — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow users to select which chemicals are on the bench from a larger database.
**Why:** Currently, `PhysicsLab.jsx` hardcodes HCl, NaOH, BTB, and MnO2. A true virtual lab needs a wider, searchable shelf.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `server/routes/reactions.js` (implement the TODO for `GET /api/chemicals`).
**How:** Finish the `GET /api/chemicals` endpoint to serve `chemicalMatrix.json`. In the client, add a `ChemicalBrowser` modal that lets users swap the 4 active `DraggableFlask` components.

### 5. Experiment Data Export — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to download their experiment history as a CSV.
**Why:** Essential for students to submit data for external reports.
**Where in code:** `client/src/pages/history.jsx` or a new component in `client/src/components/student/`.
**How:** Map the `logs` from `useHistoryStore` to CSV format and trigger a browser download.

### 6. Fast-Forward / Time Scaling — Priority: LOW | Effort: SMALL
**What:** A button to speed up reactions.
**Why:** While current reactions seem instant, future complex reactions will take time. Standard in simulations.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Add a `timeScale` state to the store and pass it as a uniform to the liquid shaders and particle systems.

### 7. Customisable Avatars/Lab Benches — Priority: LOW | Effort: SMALL
**What:** Let users pick a lab coat color or bench texture.
**Why:** Increases engagement.
**Where in code:** `client/src/pages/Profile.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`.
**How:** Save a theme preference to the user profile and pass the color to the desk mesh material.

### 8. Accessibility Settings Toggle — Priority: MEDIUM | Effort: SMALL
**What:** In-app toggles for high contrast and larger text.
**Why:** Educational tools must be accessible. PraxiLabs explicitly markets this.
**Where in code:** `client/src/components/Navbar.jsx`.
**How:** Add a settings dropdown that toggles CSS classes on the body element to trigger variables in `accessibility.css`.

### 9. Shareable Experiment Results — Priority: LOW | Effort: SMALL
**What:** Generate a unique link or image card for an experiment result.
**Why:** Encourages peer sharing.
**Where in code:** `client/src/components/ResultModal.jsx`.
**How:** Use `html2canvas` to capture the modal and allow downloading or sharing the image.

### 10. Checkpoint System — Priority: LOW | Effort: LARGE
**What:** Allow saving the state of the beaker and chemical amounts to resume later.
**Why:** Complex assignments might take multiple sessions.
**Where in code:** `client/src/store/labStore.js` and Supabase.
**How:** Create a `saved_states` table. Add a "Save Progress" button that serializes `chemA, chemB, chemI, chemC` and pushes to the DB.

## Quick Wins (< 1 day each)
1. Step-by-Step Lab Manual Overlay (Render assignment instructions).
2. Experiment Data Export (CSV download of history).
3. Accessibility Settings Toggle (UI controls for existing CSS).
