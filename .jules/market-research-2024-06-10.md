# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory using 3D simulations (React & Three.js) to let students conduct and track experiments safely.
**Market:** Virtual Science Education Software / Chemistry Simulators
**Date:** 2024-06-10
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry lab market caters to higher education and K-12 by offering safe, accessible alternatives to physical labs. Top tier platforms (Labster, PraxiLabs) provide robust analytics and instructor dashboards to evaluate performance. For Alchemistry, the primary opportunity is transitioning from a sandbox tool to a structured educational platform by introducing pre-built assignment scenarios and improved instructor insights.

## Competitor Analysis
*   **Labster:** Premium, highly gamified VR/3D labs with massive scalability. Key differentiator: comprehensive grading dashboards and deep LMS integration.
*   **PraxiLabs:** Mid-tier, scenario-based virtual labs. Key differentiator: built-in curriculum and guided lab experiences.
*   **ChemCollective:** Free, lightweight browser-based simulator. Key differentiator: quantitative problem-solving focus and scenario-based activities.

## Gap Analysis
### Table Stakes
*   **Scenario-Based Activities:** Guiding students through specific experiment goals rather than just free-play.
*   **Performance Analytics:** Dashboards for instructors to track student progress and outcomes.

### Differentiating Opportunities
*   **Contextual Tooltips/Onboarding:** Providing first-use tips directly within the 3D environment.
*   **Data Export:** Allowing students and teachers to export experiment history and results (e.g., CSV).

### UX Patterns
*   **Real-time Progress Indicators:** Showing active assignments or progress during a session.
*   **Guided Workflows:** Step-by-step instructions overlaid on the simulation.

## Prioritised Recommendations

### 1. Contextual Onboarding Tooltips — Priority: HIGH | Effort: SMALL
**What:** Add a contextual onboarding overlay for first-time users in the 3D lab.
**Why:** Competitors heavily use guided tutorials. The current lab is complex (4 sliders + AI tutor) and can overwhelm new users.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Introduce a `hasSeenTutorial` flag in `localStorage`. Wrap the slider controls and "Initiate Reaction" button with a lightweight tooltip component if the flag is false.

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to export experiment logs to CSV.
**Why:** Standard feature in all competitors (ChemCollective, Labster) to facilitate grading and offline review.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/TeacherDashboard.jsx`
**How:** Add an "Export" button that takes the existing `logs` from `historyStore` or the `experiment_logs` fetch in `TeacherDashboard` and formats it using a utility function or library like `papaparse`.

### 3. Quick Access Reaction History Panel — Priority: MEDIUM | Effort: SMALL
**What:** Implement a slide-out or overlay panel in the 3D lab to view past reactions without leaving the experiment view.
**Why:** Currently, students must navigate away to `/history`. Competitors keep essential context visible during active experiments.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** The CSS for `.lab-history-panel` and `.history-toggle` already exists in `Lab3D.css`. Implement the JSX toggle state `isHistoryOpen` and map `historyLogs` to display the recent results.

### 4. Step-by-Step Scenario Mode — Priority: MEDIUM | Effort: MEDIUM
**What:** Introduce a guided mode where students must complete specific chemical mixtures (assignments) in order.
**Why:** Moves the app from a pure sandbox to a structured curriculum tool like PraxiLabs.
**Where in code:** `client/src/store/assignmentStore.js` & `client/src/pages/Lab3D.jsx`
**How:** Utilize the existing `currentAssignments` state. Display the active assignment objective (e.g., "Mix 50% HCl and 50% NaOH") in the `Lab3D` view and automatically mark it complete upon a matching reaction result.

### 5. Automated Grading Dashboard — Priority: LOW | Effort: LARGE
**What:** Enhance the teacher dashboard to automatically calculate scores based on assignment completion and experiment outcomes.
**Why:** Reduces instructor workload and matches Labster's premium analytics feature.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` & `server/routes/classroomRoutes.js`
**How:** Create a grading algorithm that evaluates `experiment_logs` against predefined assignment parameters and displays an aggregate score column in the existing `@tanstack/react-table`.

## Quick Wins (< 1 day each)
1. Contextual Onboarding Tooltips (localStorage flag + overlay)
2. Export Experiment History to CSV (simple data formatting function)
3. Quick Access Reaction History Panel (implement existing CSS classes)
