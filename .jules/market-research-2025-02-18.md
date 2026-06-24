# Market Research Report
**App:** A web-based virtual chemistry laboratory using 3D simulations, student-teacher classroom assignments, and open-ended experimentation.
**Market:** EdTech - Virtual Science Laboratories / Interactive Educational Simulations
**Date:** 2025-02-18
**Competitors Researched:** Labster, Beyond Labz, PraxiLabs, VirtualChem Labs

## Executive Summary
The virtual science lab market is heavily focused on balancing open-ended sandbox exploration with structured, guided learning. Top competitors differentiate themselves through immersive "lab books" (interactive worksheets), realistic hazard consequences (making mistakes safely), and robust assessment reporting. Alchemistry already has a strong 3D sandbox and basic teacher/student assignment tracking. The biggest opportunities to compete with top-tier tools lie in adding exportable lab reports from existing history data, introducing a guided step-by-step checklist mode for assignments, and simulating realistic hazard consequences (e.g., temperature warnings).

## Competitor Analysis
* **Beyond Labz:** Focuses on realistic simulations where students can "cookbook" or explore freely. Differentiates with a "Lab Book" for recording data and an open-ended environment where making mistakes is part of the learning process.
* **Labster:** High-end gamified 3D simulations. Differentiates with story-driven scenarios, embedded quizzes, and an AI lab assistant.
* **PraxiLabs:** Focuses on accessibility, fast LMS integration, and an AI lab assistant.
* **VirtualChem Labs:** Targets higher education with specialized molecular dynamics and docking tools, emphasizing industry-relevant skills and expert-led workshops.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Lab Reports / Data Export:** The ability for students to export their experiment history and results as a structured lab report (PDF/CSV) to submit for grading.
* **Interactive Lab Book / Protocol Checklist:** A guided mode where students check off steps as they complete a specific procedure, moving beyond pure sandbox play.

### Differentiating Opportunities (Stand-out features)
* **Realistic Hazard Simulation:** Visual and auditory feedback when a dangerous reaction occurs (e.g., exceeding safe temperatures, glass breaking), teaching lab safety without real-world risk.
* **AI-Assisted Pre-Lab Briefings:** Using the existing AI Tutor to generate dynamic pre-lab safety and procedure quizzes based on the selected assignment.

### UX Patterns (Design/interaction patterns common in top products)
* **Persistent Notebook Sidebar:** A slide-out panel where students can jot down observations during the 3D simulation without losing context.
* **Contextual Tooltips on Equipment:** Hover states over 3D objects (beakers, burners) explaining their real-world function and current state (e.g., temperature).

## Prioritised Recommendations

### 1. Export Lab Report (PDF/CSV) — Priority: HIGH | Effort: SMALL
**What:** Allow students to export their experiment history logs as a downloadable Lab Report.
**Why:** Standard expectation in education software for submitting work. Competitors all support data export.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a "Download Lab Report" button. Use existing `logs` from `useHistoryStore` and a lightweight library like `papaparse` to map the array to a CSV file.

### 2. Guided "Lab Book" Overlay for Assignments — Priority: HIGH | Effort: MEDIUM
**What:** A slide-out checklist overlay during 3D lab sessions when a student is working on a specific assignment.
**Why:** Top competitors (Beyond Labz) emphasize the "Lab Book" feature. Alchemistry has assignments but lacks in-lab guidance.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Create a `LabBookPanel` component. Fetch the active assignment's required steps/targets and display them as a checklist that updates via the `reactionResult` state.

### 3. Realistic Hazard Indicators — Priority: MEDIUM | Effort: SMALL
**What:** Add visual warning states (e.g., screen shake, red flashing, "WARNING" toast) when dangerous chemical combinations or high concentrations are used.
**Why:** Teaching safety through safe failure is a key selling point for virtual labs.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `client/src/store/labStore.js`
**How:** Introduce a `hazardLevel` property in the reaction logic. If `hazardLevel` is high, trigger a Framer Motion animation on the `<Canvas>` wrapper and a warning toast.

### 4. Persistent Observation Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** A simple text area in a slide-out drawer where students can type notes during the experiment.
**Why:** Competitors allow data recording in-situ. Currently, Alchemistry only logs the mechanical result, not student observations.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `StudentNotebook` component (similar to `AiTutorPanel`) with a controlled textarea. Save the notes to `localStorage` or tie them to the specific experiment run in the database.

### 5. Contextual Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Hover tooltips over 3D objects indicating their name and state (e.g., "Beaker: 25°C").
**Why:** Improves onboarding and understanding of the virtual apparatus.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (and related 3D models)
**How:** Use `@react-three/drei`'s `Html` component attached to key meshes to display a lightweight floating label on `onPointerOver`.

## Quick Wins (< 1 day each)
1. **Export Lab Report (CSV):** Can be built in hours using the existing history store data.
2. **Realistic Hazard Indicators:** Easy to add simple threshold checks to the `labStore` and trigger a warning toast.
3. **Contextual Equipment Tooltips:** `@react-three/drei` makes adding 3D HTML tooltips trivial.
