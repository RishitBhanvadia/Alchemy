# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive chemistry experiments in a 3D environment and allows teachers to monitor their progress.
**Market:** Educational Technology (EdTech) - Virtual Science Labs
**Date:** 2024-05-18
**Competitors Researched:** Labster, PraxiLabs, ChemCollective, ExploreLearning Gizmos

## Executive Summary
The virtual chemistry lab market is highly focused on student engagement, realistic physics-based simulations, and robust educational scaffolding (quizzes, step-by-step manuals). Alchemistry already has a strong foundation with its 3D environment, gamified UI, and AI Tutor integration. However, it currently lacks structural educational components expected by schools, such as structured lab manuals, pre/post-experiment assessments, and detailed teacher analytics on specific concept mastery. Adding these features will transition Alchemistry from a purely exploratory sandbox into a comprehensive curriculum tool.

## Competitor Analysis
1. **Labster:** The market leader. Key differentiators include gamified storylines, high-fidelity 3D graphics, built-in quizzes, and a comprehensive lab manual that guides students through specific learning objectives.
2. **PraxiLabs:** Focuses heavily on institutional integration (LMS support), accessibility, and detailed bilingual (English/Arabic) support. Offers extensive progress tracking and assessment features.
3. **ChemCollective:** Scenario-based activities with real-world problems. Excels in collaborative features and promoting teamwork, though its UI is less modern.
4. **ExploreLearning Gizmos:** Strong focus on interactive variable manipulation, visualizing molecular interactions, and developing hypotheses. High emphasis on K-12 curriculum alignment.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Lab Manuals:** A persistent, step-by-step guide detailing the experiment's objective, procedure, and safety notes.
*   **Pre/Post-Experiment Quizzes:** Integrated assessments to ensure comprehension before and after interacting with the simulation.
*   **Data Export/Reporting:** Ability for students to download a PDF report of their experiment results and methodology.

### Differentiating Opportunities (Stand-out features)
*   **Scenario-Based Learning:** Rather than just "mixing chemicals," presenting real-world problems (e.g., "Test this water sample for contamination").
*   **Collaborative Experiments:** Real-time multiplayer labs where students can work together.
*   **Advanced Teacher Analytics:** Dashboard features that break down student performance by specific chemistry concepts, not just experiment completion.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips on First Use:** Guided onboarding tours for the lab equipment.
*   **Real-time Molecular Visualization:** A mini-window showing the molecular-level reaction as macroscopic changes happen.
*   **"Reset Step" functionality:** Ability to undo the last action without resetting the entire laboratory state.

## Prioritised Recommendations

### 1. Integrated Step-by-Step Lab Manual — Priority: HIGH | Effort: MEDIUM
**What:** A persistent, collapsible sidebar containing structured experiment instructions and learning objectives.
**Why:** Top platforms (Labster, PraxiLabs) use this to keep students focused. The current app relies heavily on an open-ended "Ask AI" approach, which may leave some students directionless.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/titration.jsx`
**How:** Create a new `LabManualSidebar.jsx` component. Update `useLabStore` to track the "current step" of a predefined experiment script, highlighting the active step in the sidebar.

### 2. Pre-Experiment Assessment Module — Priority: HIGH | Effort: SMALL
**What:** A brief, mandatory 3-question quiz modal that appears before granting access to the interactive lab area.
**Why:** Schools demand proof of learning. A pre-lab ensures students understand safety and theoretical concepts before "playing" with the simulation.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (before routing) or `client/src/pages/titration.jsx` (on load)
**How:** Create a `PreLabQuizModal.jsx` component that pauses the `isInitialLoading` state in `Lab3D.jsx` or blocks the `setting_up_exp` logic in `titration.jsx` until passed.

### 3. PDF Experiment Report Export — Priority: MEDIUM | Effort: SMALL
**What:** A button allowing students to download a formatted PDF summary of their completed experiment.
**Why:** Essential for homework submissions and LMS integration, a standard feature in competitors like ChemCollective.
**Where in code:** `client/src/pages/result.jsx` or `client/src/pages/history.jsx`
**How:** Integrate `jspdf` or `html2pdf.js`. Add a "Download Report" button in `ResultModal.jsx` or the `history.jsx` table that generates a document detailing the user, date, chemical concentrations used, and outcome.

### 4. Interactive Equipment Onboarding Tour — Priority: MEDIUM | Effort: SMALL
**What:** A guided, step-by-step tooltip tour that highlights the sliders, beaker, and AI button upon first visiting the lab.
**Why:** Improves user activation and reduces cognitive load, a common UX pattern in modern EdTech platforms.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use `react-joyride`. Add a `hasSeenLabTour` flag to `localStorage` or `useAuthStore` profile. Initialize the tour on component mount if false.

### 5. Molecular View Window (Picture-in-Picture) — Priority: LOW | Effort: LARGE
**What:** A secondary, smaller 3D canvas that displays a stylized, molecular-level animation of the chemical reaction occurring in the main beaker.
**Why:** Gizmos and Labster excel at helping students connect macroscopic changes (color shift) with microscopic realities (bond breaking).
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Create a secondary `<Canvas>` overlay in `Lab3D.jsx` that conditionally renders predefined molecular animations based on the `reactionState` and `reactionResult`.

### 6. Scenario-Based Mission Objectives — Priority: LOW | Effort: MEDIUM
**What:** Wrapping the open-ended lab in a narrative (e.g., "Analyze the soil pH for a local farm").
**Why:** ChemCollective proves that scenario-based learning increases engagement and real-world application of skills.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Add a "Missions" tab in the dashboard. Passing a `missionId` via route state to `Lab3D.jsx` alters the header text and sets predefined target values for the `onOrNot` validation logic.

### 7. Teacher Concept Mastery Dashboard — Priority: MEDIUM | Effort: MEDIUM
**What:** Visualizations showing class-wide understanding of specific concepts (e.g., "Acid-Base Neutralization" vs "Redox Reactions") rather than just experiment completion counts.
**Why:** Educators choose platforms that provide actionable diagnostic data, moving beyond basic usage metrics.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `server/controllers/teacherController.js`
**How:** Update the database schema (`experiment_results`) to include an array of `concepts_tested`. Aggregate these in the `teacherController` and render a new radar or bar chart component in the teacher analytics view.

### 8. Undo/Reset Last Action — Priority: LOW | Effort: MEDIUM
**What:** A button to revert the last chemical addition or slider adjustment without resetting the entire lab.
**Why:** Reduces frustration when a student makes a minor mistake near the end of a complex titration.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`
**How:** Implement a state history array in `useLabStore` (e.g., `pastStates`). Add an "Undo" button next to "Reset Experiment" that pops the last state and applies it.

### 9. Collaborative Lab Sessions — Priority: LOW | Effort: LARGE
**What:** Real-time synchronized 3D lab environments where multiple students can interact with the same beaker.
**Why:** Teamwork is a critical scientific skill highlighted by ChemCollective, but technically complex to implement in 3D.
**Where in code:** `client/src/pages/Lab3D.jsx` and `server/server.js`
**How:** Implement WebSockets (Socket.io) or Supabase Realtime to broadcast slider changes (`chemA`, `chemB`, etc.) and camera positions to other users in the same `classroomId` or `sessionId`.

### 10. Enhanced Accessibility (Keyboard Navigation in 3D) — Priority: HIGH | Effort: SMALL
**What:** Ensuring all sliders and the "Initiate Reaction" button are fully navigable via keyboard, and adding robust ARIA live regions for screen readers during the reaction phase.
**Why:** PraxiLabs emphasizes accessibility for institutional adoption. Alchemistry has basic ARIA tags but needs comprehensive coverage.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/titration.jsx`
**How:** Add `tabIndex={0}` and `onKeyDown` handlers to custom interactive elements (like the titration arrow buttons or chemical slider cards). Enhance the `aria-live` region in `Lab3D.jsx` to announce specific chemical percentages as they change.

## Quick Wins (< 1 day each)
1.  **Pre-Experiment Assessment Module:** Implementing a simple modal quiz before lab access is highly impactful for educational validity and technically straightforward.
2.  **Interactive Equipment Onboarding Tour:** Adding `react-joyride` to `Lab3D.jsx` significantly improves first-time user experience with minimal backend changes.
3.  **PDF Experiment Report Export:** Adding client-side PDF generation in the `history.jsx` table using `jspdf` provides immediate utility for students submitting assignments.