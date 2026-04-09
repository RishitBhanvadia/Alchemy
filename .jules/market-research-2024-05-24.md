# Market Research Report
**App:** Alchemistry is a web-based interactive 3D virtual chemistry laboratory utilizing React and Three.js, allowing students to conduct organic, inorganic, and titration experiments with real-time feedback and progress tracking.
**Market:** Virtual Science Laboratory Education Software
**Date:** 2024-05-24
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market is highly competitive and rapidly growing, catering to higher education and high school sectors. Top products focus heavily on reducing laboratory costs and improving student retention by offering gamified, realistic 3D simulations paired with robust educator tools. The biggest opportunity for Alchemistry is to move beyond being a pure "sandbox" and incorporate more structured, step-by-step learning paths, integrated assessments, and comprehensive performance analytics for teachers.

## Competitor Analysis
*   **Labster:** The market leader, offering hundreds of simulations across various STEM disciplines. Key differentiators include seamless LMS integration, detailed course mapping, and an emphasis on engaging, game-like scenarios that teach theory alongside practice.
*   **PraxiLabs:** Focuses strongly on immersive 3D simulations with an AI lab assistant ("Oxi") for real-time guidance. They offer a custom quiz builder linked directly to experiments and detailed performance analytics tracking every student action.
*   **ChemCollective:** A free, web-based virtual lab focused heavily on linking chemical computations (like stoichiometry and thermodynamics) with authentic laboratory procedures. It offers scenario-based activities and autograded problems.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **In-Lab Assessments:** Both PraxiLabs and Labster include quizzes directly integrated into or following the virtual lab experience to test comprehension of the underlying theory, not just the physical actions.
*   **Pre-lab Theory/Instructions:** Competitors provide reading materials or structured theory lessons before the student begins the simulation.
*   **Detailed Analytics for Educators:** PraxiLabs and Labster track every student action, providing more granular data than just "experiment completed."

### Differentiating Opportunities (Stand-out features)
*   **Scenario-Based Learning:** Instead of just "mix chemical A and B," providing a real-world scenario (e.g., analyzing groundwater contamination like ChemCollective) increases engagement.
*   **AI-Powered Step-by-Step Guidance:** While Alchemistry has an AI Tutor, expanding it to act as an active, step-by-step guide through complex procedures would match PraxiLabs' "Oxi" feature.

### UX Patterns (Design/interaction patterns common in top products)
*   **Integrated Action Logs:** Clear, step-by-step checklists of what needs to be accomplished during the experiment, updated in real-time as the student completes them.
*   **In-Context Quizzes:** Pop-up questions during the experiment to check understanding before allowing the student to proceed to the next step.

## Prioritised Recommendations

### 1. In-Lab Comprehension Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Add a short quiz modal that appears after a successful reaction to test the student's understanding of the theory behind the experiment.
**Why:** Top competitors (Labster, PraxiLabs) heavily emphasize theory alongside practice. It ensures students aren't just clicking randomly.
**Where in code:** `client/src/components/ResultModal.jsx` (Add a "Take Quiz" button/view) and a new `QuizModal.jsx` component.
**How:** Create a simple array of questions linked to the `reactionResult.outcome_label`. When the result modal appears, prompt the user with a 3-question quiz before fully concluding the experiment.

### 2. Step-by-Step Experiment Checklists — Priority: HIGH | Effort: MEDIUM
**What:** Introduce a UI panel in the 3D lab that lists the required steps for specific assignments (e.g., 1. Add 50% Acid, 2. Add 20% Base).
**Why:** Competitors guide students through complex procedures, reducing confusion and cognitive load, whereas Alchemistry's current `Lab3D.jsx` is more of an open sandbox.
**Where in code:** `client/src/pages/Lab3D.jsx` (New UI overlay) and `client/src/store/assignmentStore.js`.
**How:** Create an `ExperimentGuide` component that reads the current assignment steps and checks them off as the `chemA`/`chemB` states change.

### 3. Granular Educator Analytics — Priority: MEDIUM | Effort: LARGE
**What:** Enhance the Teacher Dashboard to show more detailed metrics, such as time spent on an experiment, number of failed attempts, and quiz scores.
**Why:** PraxiLabs emphasizes "Performance Analytics tracking every student's actions." Currently, `TeacherDashboard.jsx` shows basic XP and completion counts.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `server/routes/logs.js`.
**How:** Update the `experiment_logs` table schema to include `duration_seconds` and `failed_attempts`. Update the dashboard data grid to display these new metrics.

### 4. Scenario-Based Assignment Descriptions — Priority: MEDIUM | Effort: SMALL
**What:** Update the assignments feature to support rich text/scenario descriptions instead of just simple titles and target scores.
**Why:** ChemCollective uses scenarios (e.g., "Camping Problem") to contextualize chemistry, which increases student engagement.
**Where in code:** `client/src/components/student/MyAssignments.jsx` (or wherever assignments are rendered in `StudentDashboard.jsx`).
**How:** Expand the assignment rendering to show a `scenario_description` field from the database, providing a real-world context for the required experiment.

### 5. Pre-Lab Theory Modals — Priority: LOW | Effort: SMALL
**What:** Before entering the 3D lab for an assignment, show a brief "Theory Review" modal.
**Why:** Standard practice in virtual labs (Labster) to ensure students understand the concepts before experimenting.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (Intercept the click on the "Laboratory" module card if an assignment is active).
**How:** Add a simple confirmation modal with a few paragraphs of text related to the current active assignment before routing to `/student/lab`.

### 6. Interactive Element Identification — Priority: LOW | Effort: MEDIUM
**What:** Allow students to click on 3D objects (beakers, burners) to read their names and purposes.
**Why:** Improves familiarization with real lab equipment, a common feature in comprehensive virtual labs.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx`.
**How:** Add `onClick` handlers to Three.js meshes that trigger a tooltip or update a state variable in `Lab3D.jsx` to display information about the clicked item.

### 7. Exportable Lab Reports — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to export their experiment history and results as a PDF or CSV.
**Why:** Essential for integrating with traditional grading systems where teachers require submitted reports.
**Where in code:** `client/src/pages/history.jsx` or `client/src/components/ResultModal.jsx`.
**How:** Implement a simple "Export Report" button using a library like `jspdf` or standard CSV generation from the `historyLogs` state.

### 8. Gamified Badges UI Enhancement — Priority: LOW | Effort: SMALL
**What:** Make the badges more prominent in the Student Dashboard, showing greyed-out badges for upcoming milestones.
**Why:** Labster and PraxiLabs emphasize gamification to boost retention. `TeacherDashboard.jsx` calculates badges, but students need more visibility.
**Where in code:** `client/src/pages/StudentDashboard.jsx`.
**How:** Add a "My Achievements" section displaying icons for badges earned (based on the `logs.length / 5` logic seen in the teacher dashboard).

### 9. Guided AI Error Correction — Priority: MEDIUM | Effort: MEDIUM
**What:** Instead of a generic "Something went wrong" error toast, use the AI tutor to suggest *why* a reaction failed based on the inputs.
**Why:** Turns failures into learning opportunities, similar to PraxiLabs' real-time guidance.
**Where in code:** `client/src/pages/Lab3D.jsx` (`handlePlayClick` error block) and `server/routes/ai.js`.
**How:** When a reaction fails or produces an unexpected result, pass the `chemA`, `chemB`, etc., values to the AI endpoint and display its specific feedback instead of a standard toast.

### 10. Direct LMS Integration Hooks (Preparation) — Priority: LOW | Effort: LARGE
**What:** Begin structuring the backend authentication to support LTI (Learning Tools Interoperability) for future Canvas/Blackboard integration.
**Why:** Seamless LMS integration is a major selling point for PraxiLabs and Labster.
**Where in code:** `server/routes/auth.js` and Supabase configuration.
**How:** This is an architectural recommendation: ensure user IDs and classroom IDs are decoupled enough to map to external LMS user IDs in the future.

## Quick Wins (< 1 day each)
1.  **Scenario-Based Assignment Descriptions:** Simply add a new text field to the UI and database.
2.  **Exportable Lab Reports:** Can be done quickly using basic JS string manipulation and a Blob download.
3.  **Gamified Badges UI Enhancement:** Minor UI update to the `StudentDashboard.jsx` to render simple SVG icons based on experiment count.
