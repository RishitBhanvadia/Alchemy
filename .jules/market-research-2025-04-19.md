# Market Research Report
**App:** Alchemistry - A 3D interactive virtual chemistry laboratory for students with teacher monitoring.
**Market:** EdTech Virtual STEM Labs
**Date:** 2025-04-19
**Competitors Researched:** Labster, PraxiLabs, ChemCollective, PhET Interactive Simulations

## Executive Summary
The EdTech virtual science lab market is shifting from open-ended sandboxes (like PhET) to structured, gamified learning environments with robust assessment and LMS integration (like Labster and PraxiLabs). Alchemistry has a strong foundation with its 3D interactive canvas (`Lab3D.jsx`) and teacher dashboards (`TeacherDashboard.jsx`). The primary opportunity lies in closing the gap between a free-form simulation and a structured curriculum tool by adding built-in assessments, guided experiment narratives, and actionable data exports for educators.

## Competitor Analysis
- **Labster:** The market leader. Focuses on immersive, gamified storylines and structured experiment narratives. Key differentiator is tying experiments directly to curriculum goals and providing automated grading.
- **PraxiLabs:** Focuses heavily on realism, safety, and integration. Offers an AI Lab Assistant ("Oxi"), custom quiz builders linked to experiments, and extensive LMS integration. Highly structured.
- **ChemCollective:** Scenario-based and problem-solving oriented. Lower visual fidelity but strong pedagogical foundation with real-world problems.
- **PhET:** Highly accessible, open-ended interactive simulations. Great for intuitive understanding but lacks built-in assessment or narrative structure.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Exportable Data:** Students need to submit results; teachers need to analyze them. `history.jsx` currently only displays data in a table.
- **Guided Tutorials:** First-time users in a 3D space need onboarding. The current `Lab3D.jsx` drops users in with a "mix 2 chemicals" warning but lacks a structured walkthrough.
- **Formative Assessment:** Quizzes or questions linked directly to the experiment outcome to verify understanding, not just task completion.

### Differentiating Opportunities (Stand-out features)
- **Integrated Lab Notebook:** A dedicated space during the 3D experiment (`Lab3D.jsx`) for students to write notes and hypotheses alongside the AI tutor, rather than just viewing results post-reaction.
- **Teacher-Defined Scenarios:** Allowing teachers to pre-configure required chemicals or expected outcomes in `ClassroomDetail.jsx` rather than just locking chemicals.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Tooltips:** Explaining chemical properties *before* mixing.
- **Progress Indicators:** A step-by-step checklist within structured experiments to show students how close they are to completion.

## Prioritised Recommendations

### 1. CSV Data Export for History — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to export their experiment logs as a CSV file.
**Why:** Data export is a table-stakes feature for educational tools, allowing integration with external grading systems or lab reports.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" button to the `history-container` header. Use the existing `logs` array from `useHistoryStore` and a simple mapping function to generate and download a CSV blob.

### 2. Guided Interactive Tutorial Overlay — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step guided tour for the first visit to the 3D Lab.
**Why:** 3D interfaces can be intimidating. Competitors heavily feature onboarding to ensure students understand the controls.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/authStore.js`
**How:** Add a `hasSeenTutorial` boolean to the user profile/local storage. Use a library like `react-joyride` or custom overlay components pointing to the chemical sliders and the "Initiate Reaction" button.

### 3. In-Lab Digital Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** A side panel allowing students to type notes during the experiment, which are then saved to the experiment history.
**Why:** Connects the physical simulation to the scientific method (hypothesis, observation).
**Where in code:** `client/src/pages/Lab3D.jsx` and the Supabase database schema for experiment logs.
**How:** Add a collapsible "Notebook" panel next to the `AiTutorPanel`. Update `initiateReaction` in `labStore.js` to include the current notebook text when saving the result.

### 4. Chemical Property Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Hover-over tooltips on the chemical sliders explaining what the chemical is (e.g., "NaOH - Strong Base").
**Why:** Improves learning outcomes by providing immediate context rather than requiring students to guess or ask the AI.
**Where in code:** `client/src/pages/Lab3D.jsx` (slider cards).
**How:** Add `title` attributes or a simple custom React tooltip component to the `.label-group` elements in the chemical selection UI.

### 5. Teacher Assignment Creation — Priority: HIGH | Effort: LARGE
**What:** Allow teachers to define specific "Assignments" (e.g., "Synthesize Water") rather than just locking chemicals.
**Why:** Moves the platform from a sandbox to a structured curriculum tool, directly matching Labster's value proposition.
**Where in code:** `client/src/pages/ClassroomDetail.jsx` and new database tables.
**How:** Create a UI for teachers to define target chemicals and expected outcomes. Link these assignments to classroom memberships.

### 6. Post-Experiment Quiz Modal — Priority: MEDIUM | Effort: MEDIUM
**What:** A short 1-3 question quiz that appears *after* a successful reaction, testing understanding of what just happened.
**Why:** Matches PraxiLabs' custom quiz builder feature to ensure comprehension.
**Where in code:** `client/src/components/ResultModal.jsx`.
**How:** Extend the `ResultModal` to include an optional "Knowledge Check" tab or step before the modal can be fully dismissed. The AI Tutor could generate these questions based on `reactionResult`.

### 7. Real-Time Safety Warnings — Priority: LOW | Effort: SMALL
**What:** Visual warnings (e.g., a flashing icon) when selecting incompatible or dangerous chemical combinations *before* mixing.
**Why:** Emphasizes lab safety, a key selling point for virtual labs over physical ones.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Create a derived state in `labStore.js` that checks current chemical selections against a dictionary of dangerous combinations, rendering a warning banner if triggered.

### 8. Experiment Categorization Filtering — Priority: LOW | Effort: SMALL
**What:** Add tabs or filters to the History page to view only Organic, Inorganic, or Titration experiments.
**Why:** As students complete more experiments, the list becomes unwieldy.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add a state variable for `activeFilter` and filter the `logs.map` array based on `exp.experiment_type`.

### 9. Gamified Badges/Achievements — Priority: LOW | Effort: MEDIUM
**What:** Award badges for milestones (e.g., "First Reaction", "Safety First").
**Why:** Increases student engagement and retention, a proven strategy from Labster.
**Where in code:** `client/src/pages/Profile.jsx` and a new `achievements` store/table.
**How:** Create an achievement checking function that runs after `initiateReaction` succeeds. Display unlocked badges on the `Profile` page.

### 10. Dashboard Quick-Stats Widget — Priority: MEDIUM | Effort: SMALL
**What:** Show the total number of experiments completed and success rate directly on the Student Dashboard.
**Why:** Provides immediate feedback and a sense of progression upon login.
**Where in code:** `client/src/pages/StudentDashboard.jsx`.
**How:** Fetch summary statistics from `useHistoryStore` and render them in a new dashboard card component.

## Quick Wins (< 1 day each)
1. **CSV Data Export in History:** Simple frontend mapping of existing data to a downloadable file.
2. **Chemical Property Tooltips:** Adding descriptive text to existing UI elements in `Lab3D.jsx`.
3. **Experiment Categorization Filtering:** Adding basic array filtering to the existing list rendering in `history.jsx`.
