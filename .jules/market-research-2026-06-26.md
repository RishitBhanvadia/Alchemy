# Market Research Report
**App:** Alchemistry - an interactive 3D virtual chemistry laboratory utilizing Three.js and Supabase for real-time experiments and student progress tracking.
**Market:** Educational Technology (EdTech) / Virtual STEM Laboratory Simulations
**Date:** 2026-06-26
**Competitors Researched:** PraxiLabs, ChemVerse, PhET / Labster

## Executive Summary
The Virtual Chemistry Lab market focuses on providing students a safe, hazard-free 3D environment to perform experiments while delivering actionable performance insights to educators. Top platforms emphasize LMS integration, multi-level guided experiments, strict lab safety training, and comprehensive analytics for teachers. Alchemistry has a solid foundation with its 3D environment, AI tutor, and gamified dashboards. The biggest opportunities lie in providing educators with exportable analytics, adding explicit safety onboarding, and giving students immediate, contextual feedback through a dedicated quiz module.

## Competitor Analysis
- **PraxiLabs**: A premium, widely adopted platform offering 210+ simulations. Key differentiators include an AI lab assistant, custom quiz builder, comprehensive performance analytics, seamless LMS integration, and multi-language support.
- **ChemVerse**: A free, web-based platform tailored for Class 9–12 & BSc students. Key differentiators include a structured multi-level approach (Beginner to Master), persistent XP/Achievement system, and a dedicated Apparatus Room and Lab Safety Training module.
- **PhET Interactive Simulations / Labster**: Widely recognized for accessibility. Key differentiators include strong safety training modules embedded in lab workflows, equipment-level actions with step guidance, and rich feedback from measured results (titrations, spectroscopy).

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
- **Data Export for Teachers**: Competitors offer CSV/PDF reports for student progress. Alchemistry has a Teacher Dashboard with a data grid but lacks the ability to export this data.
- **Pre-lab Safety Training**: Competitors require safety protocol training before entering the virtual lab. Alchemistry jumps straight into the 3D lab environment.

### Differentiating Opportunities (Stand-out features)
- **Apparatus Room / Equipment Tutorial**: ChemVerse offers a specific mode to explore and learn about equipment before doing an experiment.
- **Post-Experiment Quizzes**: PraxiLabs includes a custom quiz builder linked to experiments. Alchemistry has a result modal but lacks a formal assessment mechanism to test theoretical understanding.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual, Step-by-Step Guidance**: Competitors utilize side-panels with exact procedures, materials, and expected observations dynamically updating as the student progresses. Alchemistry has a history/logs panel, but guided step-by-step checklists are not explicitly segmented.

## Prioritised Recommendations

### 1. CSV Data Export for Teachers — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to export student progress and experiment scores.
**Why:** Teachers require offline access and record-keeping for grades and LMS integration. It is a standard expectation.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` (inside the Classroom Analytics view).
**How:** Utilize the existing data provided to the `@tanstack/react-table` instance. Add a button that maps the row data to a CSV string and triggers a file download using a Blob. (~30 lines of code).

### 2. Mandatory Lab Safety Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** An onboarding modal or separate route explaining lab safety protocols before a student's first experiment.
**Why:** Competitors emphasize safety training as a core pedagogical value of virtual labs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/authStore.js`.
**How:** Add a `hasCompletedSafetyTraining` boolean to the student profile in Supabase. Check this flag in `Lab3D.jsx`; if false, render a `SafetyTrainingModal` component instead of the 3D scene.

### 3. Apparatus Exploration Mode — Priority: MEDIUM | Effort: MEDIUM
**What:** A specific UI mode to click on lab equipment and learn its name, purpose, and proper usage.
**Why:** Reduces cognitive load for students who are unfamiliar with lab equipment before starting complex experiments.
**Where in code:** `client/src/pages/Lab3D.jsx` or a new `ApparatusRoom.jsx` route.
**How:** Add a 'Free Explore' mode to the Three.js canvas where `onClick` events on 3D models (like `Beaker.jsx` or `Flask.jsx`) trigger a generic informative tooltip modal.

### 4. Post-Experiment Assessment Quiz — Priority: MEDIUM | Effort: LARGE
**What:** A short 3-5 question quiz after completing an experiment (e.g., Titration) to test theoretical concepts.
**Why:** Links practical simulation with theoretical understanding, a feature highly valued by educators (seen in PraxiLabs).
**Where in code:** `client/src/components/ResultModal.jsx` or a new `QuizModal.jsx`.
**How:** Instead of just showing the final result, present a multi-step modal with multiple-choice questions before granting the XP/score. Add a new Supabase table `quizzes` to store questions and answers.

### 5. Step-by-Step Procedure Checklist — Priority: LOW | Effort: SMALL
**What:** A visual checklist of the experiment procedure that checks off automatically as the user completes actions.
**Why:** Improves UX by making it clear what the student needs to do next, a common pattern in PhET and ChemVerse.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `client/src/store/labStore.js`.
**How:** Add a `currentStepIndex` to `labStore`. Render a fixed side-panel listing the steps, highlighting the current step based on the index.

## Quick Wins (< 1 day each)
1. **CSV Data Export**: High impact for teachers, very easy to implement since the data is already structured in memory via `@tanstack/react-table`.
2. **Apparatus Tooltips**: Easy to implement by adding an `onClick` handler to existing Three.js components that populates a simple info state.
3. **Procedure Checklist**: Can be built purely on the frontend by mapping the required actions to a simple UI list.
