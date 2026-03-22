# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Virtual STEM/Chemistry Lab Software (EdTech)
**Date:** 2026-03-22
**Competitors Researched:** ChemCollective Virtual Lab, PraxiLabs, Labster

## Executive Summary
The virtual chemistry lab market focuses heavily on safe, interactive, and structured educational experiences. Top products differentiate by offering not just the simulation, but the entire learning wrapper—pre/post-labs, gamified guidance, comprehensive analytics, and seamless curriculum alignment. Alchemistry has a strong core with its 3D interactive physics and AI Tutor, but lacks structured assessment and guided workflows that top competitors offer. The biggest opportunities lie in adding robust assessment tools (quizzes/pre-labs) and structured, gamified lab manuals to guide the student experience.

## Competitor Analysis
*   **ChemCollective Virtual Lab:** A highly customizable simulation focusing on aqueous chemistry. Key differentiators include strong support for homework loading, pre- and post-labs to separate conceptual learning from technique, and specific data viewers (like aqueous species concentration).
*   **PraxiLabs:** Offers highly immersive 3D interactions with a strong gamification focus (hints, lab manuals, skipping ahead, walkthrough videos). Differentiates with a custom quiz builder linked to experiments, comprehensive performance analytics tracking every student action, and an AI lab assistant ("Oxi").
*   **Labster:** Focuses on curriculum-aligned, self-paced, on-demand virtual learning labs (10-60 minutes). Differentiates through its broad curriculum alignment and practice activities designed to build confidence and mastery.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Pre/Post Assessments:** Competitors use quizzes before or after experiments to assess conceptual understanding. Alchemistry currently relies only on the experimental outcome.
*   **In-Lab Manuals/Walkthroughs:** A step-by-step guide or manual directly accessible during the experiment.

### Differentiating Opportunities (Stand-out features)
*   **Custom Quiz Builder:** Allowing teachers to build specific questions tied to experiment outcomes (like PraxiLabs).
*   **Granular Action Tracking:** Tracking every action a student takes during an experiment for deeper analytics, rather than just the final score.

### UX Patterns (Design/interaction patterns common in top products)
*   **Gamified Guidance:** Providing hints, warnings for toxic materials, and walkthrough videos in a game-like format.
*   **Data Viewers:** Dedicated UI panels for specific scientific data (e.g., concentration viewers).

## Prioritised Recommendations

### 1. Pre- and Post-Lab Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Introduce customizable quizzes that students must complete before starting an experiment (pre-lab) and after finishing (post-lab) to test theoretical knowledge.
**Why:** ChemCollective and PraxiLabs emphasize separating conceptual learning from practical technique. This ensures students understand *why* they are doing the experiment, a table-stakes feature in EdTech.
**Where in code:** `client/src/pages/Lab3D.jsx` (to block access until pre-lab is done) and `server/controllers/teacherController.js` (for managing quiz data). Create a new `QuizModal.jsx` component.
**How:** Add a `has_completed_prelab` boolean to the experiment session state. If false, render a `QuizModal` over the 3D Canvas. Fetch quiz questions from a new Supabase table linked to the experiment ID.

### 2. Interactive Lab Manual Sidebar — Priority: HIGH | Effort: SMALL
**What:** A slide-out sidebar or persistent panel detailing step-by-step instructions for the current experiment.
**Why:** PraxiLabs uses lab manuals and walkthroughs to guide students. Currently, Alchemistry only has a basic prompt ("Drag and pour..."). A manual provides necessary scaffolding for complex experiments.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/LabManual.jsx` (new file).
**How:** Create a toggleable `LabManual` component next to the `AiTutorPanel`. Store markdown or JSON step-by-step instructions in the `data/` folder or fetch from Supabase based on the active experiment.

### 3. Real-time Concentration Viewer — Priority: MEDIUM | Effort: SMALL
**What:** A UI panel that dynamically displays the specific concentrations (Molarity) or amounts of elements currently in the beaker.
**Why:** ChemCollective provides a "concentration viewer" to help students connect visual changes with mathematical reality. This bridges the gap between the 3D simulation and chemical theory.
**Where in code:** `client/src/pages/Lab3D.jsx` (within the `chem-levels-panel`) or a new `ConcentrationViewer.jsx` component.
**How:** Map the existing `chemA`, `chemB`, etc., state variables to their real-world molarities. Display these calculated values in a small floating panel overlaying the 3D canvas or within the control grid.

### 4. Granular Action Analytics Tracking — Priority: MEDIUM | Effort: MEDIUM
**What:** Log specific actions a student takes during the simulation (e.g., "Added 10% HCl", "Reset Lab", "Asked AI Tutor") rather than just the final result.
**Why:** PraxiLabs highlights tracking every student action for automated performance reports, allowing teachers to identify exactly where students struggle.
**Where in code:** `client/src/store/labStore.js` and `server/controllers/teacherController.js`.
**How:** Implement an `actionLog` array in `labStore`. Push events to this array during state changes (e.g., inside `setChemA`, `handlePlayClick`). Send this array to the server alongside the final reaction result in `initiateReaction`.

### 5. Custom Quiz Builder for Teachers — Priority: LOW | Effort: LARGE
**What:** An interface in the Teacher Dashboard allowing educators to create their own pre/post-lab questions linked to specific experiments.
**Why:** PraxiLabs' custom quiz builder empowers teachers to tailor the lab to their specific curriculum needs, increasing adoption in diverse classrooms.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and new API routes in `server/routes/`.
**How:** Add a new tab to `TeacherDashboard`. Build a form to create questions, select types (multiple choice, text), and link them to `experiment_id`. Store in a new `custom_quizzes` Supabase table.

### 6. Interactive Element Warnings — Priority: LOW | Effort: SMALL
**What:** Show cautionary notes or popups for toxic materials when interacting with hazardous chemicals.
**Why:** PraxiLabs has "cautionary notes for toxic materials" as part of their gamified guidance. This reinforces lab safety rules virtually.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Check chemical types (e.g. HCl, NaOH) when their slider values change or they are hovered, and display a small warning toast if they are marked as hazardous in a config object.

### 7. Skip-Ahead / Fast-Forward Simulation — Priority: LOW | Effort: MEDIUM
**What:** Allow students to skip certain steps or fast-forward long reactions, but record this action for the teacher.
**Why:** PraxiLabs offers the ability to skip ahead at any stage, which improves user experience for long experiments while still tracking the shortcut for grading.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a "Skip to Result" button that automatically sets the chemical sliders to the target values or completes the `reactionState`, while pushing a "Skipped" event to the analytics log.

### 8. Real-time Homework Checking Integration — Priority: LOW | Effort: LARGE
**What:** Allow students to input answers to mathematical calculations (e.g., predicted final concentration) and have the lab simulation verify the answer based on the real-time simulation state.
**Why:** ChemCollective uses the virtual lab to check the results of pencil-and-paper calculations or qualitative predictions ("Predict and check").
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/ResultModal.jsx`
**How:** Add an input field for predicted outcomes before the reaction starts. When the reaction completes, compare the predicted outcome with the actual `reactionResult` and display feedback.

### 9. Multi-Language / Bilingual Support — Priority: LOW | Effort: LARGE
**What:** Support for multiple languages in the simulation UI and instructions.
**Why:** PraxiLabs offers bilingual customization. Expanding language support broadens the market reach significantly.
**Where in code:** `client/src/utils/i18n.js` (new) and wrapping components in translation functions.
**How:** Implement a library like `react-i18next`. Extract all hardcoded strings (especially in `Lab3D.jsx` and `ResultModal.jsx`) into JSON translation files.

### 10. Walkthrough Videos / Demos — Priority: LOW | Effort: MEDIUM
**What:** Short, embedded video clips or guided animated tutorials showing how to use the lab correctly.
**Why:** PraxiLabs includes walkthrough videos to help onboard students and reduce confusion when they first encounter the 3D interface.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `TutorialOverlay.jsx` component.
**How:** Add a "Help/Tutorial" button that opens a modal with an embedded video or a series of animated GIFs demonstrating how to use the sliders and initiate reactions.

## Quick Wins (< 1 day each)
1.  **Interactive Lab Manual Sidebar:** Can be implemented quickly using static JSON data for existing experiments and a simple toggle UI component.
2.  **Interactive Element Warnings:** Adding a config for hazardous chemicals and displaying a toast notification on interaction is a fast implementation.
3.  **Real-time Concentration Viewer:** Requires simple math to convert slider percentages to molarity and a small UI update to `Lab3D.jsx`.