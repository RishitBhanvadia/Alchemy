# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory allowing students to conduct interactive 3D chemistry experiments while providing teachers with analytics and classroom management tools.
**Market:** EdTech / Virtual Science Laboratories (K-12 & Higher Ed)
**Date:** 2026-05-21
**Competitors Researched:** PraxiLabs, ChemVerse, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is transitioning from pure simulation sandbox environments to structured, curriculum-aligned educational platforms. While Alchemistry has strong 3D simulation capabilities (Three.js/React Three Fiber) and role-based access, it lacks the guided learning paths, safety enforcement mechanics, and real-time assessments found in top competitors. Adding guided procedures, a student logbook, and in-experiment quizzes will significantly increase its value to educators and alignment with practical exam preparation.

## Competitor Analysis
* **PraxiLabs:** Focuses on realistic 3D environments with heavy curriculum alignment. Key differentiators include an AI Lab Assistant, custom quiz builders for teachers, and actionable analytics.
* **ChemVerse:** A free platform targeted at Class 9-12 and BSc students. Highly structured around specific school curriculum experiments (e.g., Acid-Base Titration) offering guided steps, aim, materials, and observation recording.
* **PhET Interactive Simulations:** The industry standard for free science simulations. Focuses on intuitive, gamified sandbox exploration rather than strict procedural lab work, but includes strong visual indicators for underlying chemical concepts (e.g., showing molecular level interactions).

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Guided Procedures:** Step-by-step instructions (Aim, Materials, Procedure) overlaid on the simulation.
* **Safety Protocols Check:** A mechanism requiring students to acknowledge or perform safety checks (e.g., equipping virtual goggles) before starting.
* **Curriculum Alignment Labels:** Tagging experiments by grade level or specific curriculum standards.

### Differentiating Opportunities (Stand-out features)
* **Integrated Logbook:** A digital notebook where students record observations and data during the experiment, which can be submitted to the teacher.
* **In-Experiment Quizzes:** Short, contextual knowledge checks triggered at key steps in a reaction to ensure comprehension, rather than just post-experiment results.

### UX Patterns (Design/interaction patterns common in top products)
* **Split-Screen Interface:** 3D simulation on one side, guided instructions and logbook on the other.
* **Visual Molecular Models:** Toggling between macroscopic view (beakers) and microscopic view (molecular interactions).
* **Reset to Checkpoint:** Allowing students to undo a single step rather than resetting the entire experiment if they make a mistake.

## Prioritised Recommendations

### 1. Guided Procedure Overlay — Priority: HIGH | Effort: MEDIUM
**What:** Add a side panel in the 3D lab that walks students through step-by-step instructions for specific experiments.
**Why:** Top competitors like ChemVerse use guided steps to help students prepare for practical exams. Alchemistry currently drops users into a sandbox, which can be overwhelming without instruction.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a new `GuidedProcedurePanel` component alongside `AiTutorPanel`).
**How:** Create a state array of steps and a "Next Step" button. Highlight required controls (sliders/buttons) based on the current step.

### 2. Student Observation Logbook — Priority: HIGH | Effort: MEDIUM
**What:** A digital notebook where students must record their observations (color changes, gas evolution) before getting the final result.
**Why:** Real chemistry requires observation. Writing down findings improves retention and provides tangible artifacts for teachers to grade.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/Lab3D.jsx`.
**How:** Before showing the `ResultModal`, prompt the user with a form to enter observations. Save this data to the database and display it in `client/src/pages/history.jsx`.

### 3. In-Experiment Knowledge Checks — Priority: MEDIUM | Effort: SMALL
**What:** Pop-up multiple-choice questions triggered during the reaction phase.
**Why:** PraxiLabs uses quizzes to ensure active engagement. It prevents students from just blindly clicking "Initiate Reaction".
**Where in code:** `client/src/pages/Lab3D.jsx` (during the `reactionState === 'loading'` phase).
**How:** Pause the loading state, display a quick question related to the mixed chemicals, and resume the reaction once answered correctly.

### 4. Virtual Lab Safety Check — Priority: MEDIUM | Effort: SMALL
**What:** A mandatory checklist (e.g., "Put on goggles", "Put on gloves") before allowing the user to interact with chemicals.
**Why:** Table stakes for educational virtual labs to enforce real-world safety habits.
**Where in code:** `client/src/pages/Lab3D.jsx` (Initialization phase).
**How:** Add a modal on mount that requires the user to click toggles for safety equipment before unlocking the `slider-grid`.

### 5. Molecular View Toggle — Priority: LOW | Effort: LARGE
**What:** A button to switch from macroscopic beakers to a 2D/3D visualization of molecules interacting.
**Why:** PhET simulations excel at building conceptual understanding by showing the microscopic level.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `MolecularView` component.
**How:** Use Three.js to render animated particle models of the specific chemicals reacting when a toggle is active.

### 6. Teacher Custom Quiz Builder — Priority: MEDIUM | Effort: LARGE
**What:** Allow teachers to attach custom questions to experiments assigned to their classroom.
**Why:** PraxiLabs offers this to give educators control over assessments.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/ClassroomManager.jsx`.
**How:** Add a tab in the Teacher Dashboard to create a quiz JSON object, save it to the Supabase database linked to an experiment, and fetch it in `Lab3D.jsx`.

### 7. Step Undo / Checkpoint System — Priority: LOW | Effort: MEDIUM
**What:** Allow students to revert their last chemical addition without resetting the entire lab.
**Why:** Reduces frustration when a minor mistake is made in a multi-step procedure.
**Where in code:** `client/src/pages/Lab3D.jsx` (State management).
**How:** Keep a history stack of `chemA`, `chemB`, etc., states and add an "Undo" button to pop the last state.

### 8. Curriculum Standard Tags — Priority: LOW | Effort: SMALL
**What:** Tag modules (Organic, Inorganic, Titration) with standard curriculum labels (e.g., "Class 10", "AP Chemistry").
**Why:** Helps teachers easily find relevant content for their syllabus.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (in the `MODULE_CARDS` constant).
**How:** Add a `tags` array to each module object and render them as small pill badges on the UI cards.

### 9. Export Lab Report as PDF — Priority: LOW | Effort: SMALL
**What:** Allow students to download a summary of their completed experiment.
**Why:** Standard feature in educational tools for submitting homework.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/history.jsx`.
**How:** Add an "Export PDF" button that uses `window.print()` or a library like `jspdf` to capture the result details.

### 10. AI Tutor Prompt Suggestions — Priority: MEDIUM | Effort: SMALL
**What:** Pre-fill the `AiTutorPanel` with contextual question chips (e.g., "Why did it turn green?") based on the current reaction state.
**Why:** Reduces friction for students to engage with the AI tutor.
**Where in code:** `client/src/components/AiTutorPanel.jsx`.
**How:** Pass the current `chemA`, `chemB`, and `reactionResult` as props to the panel and generate 3 dynamic suggestion buttons.

## Quick Wins (< 1 day each)
1. **Curriculum Standard Tags:** Update the `MODULE_CARDS` array in `StudentDashboard.jsx` to include educational grade levels.
2. **Virtual Lab Safety Check:** Add a simple pre-experiment checklist modal to `Lab3D.jsx`.
3. **AI Tutor Prompt Suggestions:** Add contextual quick-question buttons to `AiTutorPanel.jsx`.
