# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory for students to conduct interactive, safe chemistry experiments with teacher oversight.
**Market:** Educational Technology (EdTech) - Virtual Science Labs (K-12 & Higher Education)
**Date:** 2024-05-03
**Competitors Researched:** Labster, PhET Interactive Simulations, Beyond Labz, PraxiLabs

## Executive Summary
The virtual chemistry lab market is rapidly growing, driven by the need for accessible, scalable, and safe practical science education. While Alchemistry provides a strong foundation with React Three Fiber 3D simulations and role-based access, leading competitors differentiate through deep engagement (narratives/gamification), robust accessibility, and seamless integration with existing educational workflows. By implementing specific UX patterns like data exports, interactive onboarding, and variable manipulation, Alchemistry can significantly close the gap with established players.

## Competitor Analysis
* **Labster:** Leads with highly immersive, story-driven 3D narratives that contextualize experiments. Strong gamification but can be resource-heavy.
* **PhET Interactive Simulations:** Excels in real-time variable manipulation (sliders for temperature, concentration) and visual feedback. Highly accessible and free, widely used for quick concept demonstrations.
* **Beyond Labz:** Focuses on open-ended sandbox environments with high freedom, mimicking real-world higher-education labs with detailed lab notebooks.
* **PraxiLabs:** Provides strong gamification, step-by-step guidance, and integrated assessment/quizzing to ensure concept retention.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Data Export:** Teachers and students expect to export lab results for LMS integration or lab reports.
* **Guided Onboarding:** 3D interfaces have a steep learning curve; contextual tooltips for first-time users are standard.

### Differentiating Opportunities (Stand-out features)
* **Real-time Variable Manipulation:** Moving beyond discrete chemical mixing to continuous environmental control (e.g., temperature sliders).
* **Contextual "Mission Briefs":** Wrapping assignments in narrative context rather than simple target scores.

### UX Patterns (Design/interaction patterns common in top products)
* **Gamification Badges:** Visual rewards for completing specific types of experiments.
* **Keyboard Hotkeys:** Power-user controls for managing lab equipment quickly.
* **Post-experiment Reflection:** Concept-check questions before a result is finalized.

## Prioritised Recommendations

### 1. Lab History CSV Export — Priority: HIGH | Effort: SMALL
**What:** Add a button to download past experiment logs as a CSV file.
**Why:** Standard feature in Beyond Labz; crucial for students writing lab reports and teachers grading.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that maps the `historyLogs` state to a CSV string using Papa Parse or a simple Blob approach, triggering a browser download.

### 2. Teacher Analytics Data Export — Priority: HIGH | Effort: SMALL
**What:** Allow teachers to download class performance and assignment data as CSV.
**Why:** Teachers need to ingest grades into their school's LMS (Canvas/Blackboard).
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Implement a download action that formats the aggregated assignment data into a CSV format.

### 3. Step-by-Step Interactive Lab Tour — Priority: HIGH | Effort: MEDIUM
**What:** A first-use tooltip overlay explaining the 3D lab controls.
**Why:** 3D environments (like Labster) require onboarding. New users might not know how to interact with the Beaker or AI Tutor.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a `hasSeenLabTour` flag in `localStorage`. Use a custom overlay or lightweight tooltip component to highlight the chemical selectors, AI panel, and history panel sequentially.

### 4. Real-time Variable Sliders (Temperature) — Priority: HIGH | Effort: MEDIUM
**What:** Interactive sliders to manipulate environmental variables dynamically.
**Why:** PhET's core strength is real-time visualization of variable changes, enhancing intuitive understanding.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `temperature` state to `labStore`. Render a slider overlay in `Lab3D.jsx` that updates this state, and pass it down to `PhysicsLab` to affect reaction speeds or visuals.

### 5. Keyboard Shortcuts for Lab Equipment — Priority: MEDIUM | Effort: SMALL
**What:** Hotkeys (e.g., '1', '2', 'R') to quickly add chemicals or reset the lab.
**Why:** Common in desktop simulation software to improve accessibility and workflow speed.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `useEffect` with a `keydown` event listener that maps keys to `useLabStore` actions (e.g., `setChemA`, reset).

### 6. Achievement Badges for Experiment Types — Priority: MEDIUM | Effort: MEDIUM
**What:** Visual badges unlocked on a student's profile for completing different experiment categories (Titration, Organic).
**Why:** PraxiLabs uses gamification successfully to motivate students to explore the sandbox.
**Where in code:** `client/src/pages/Profile.jsx`
**How:** Compute unlocked badges dynamically based on the `logs` array from `useHistoryStore`, rendering simple SVG or emoji icons for achieved milestones.

### 7. Narrative "Mission Briefs" for Assignments — Priority: MEDIUM | Effort: SMALL
**What:** Contextual framing modal for assignments before entering the lab.
**Why:** Story-driven approaches (Labster) dramatically increase engagement.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/store/assignmentStore.js`
**How:** When a student clicks an assignment, display a "Mission Brief" modal with a narrative description (e.g., "Analyze this unknown acid") before navigating to `/lab`.

### 8. Post-Experiment Concept Check — Priority: MEDIUM | Effort: MEDIUM
**What:** A short reflection question before logging the final result.
**Why:** Ensures active learning rather than passive clicking through experiments.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Modify the modal to present a simple dynamic question based on the `outcome_label` before the user can click the final submit/log button.

### 9. Experiment "Recipe Book" Presets — Priority: LOW | Effort: MEDIUM
**What:** A library of known, interesting reactions students can quick-load.
**Why:** Reduces friction for discovery and serves as an interactive tutorial.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/store/labStore.js`
**How:** Add a "Presets" section to the dashboard that dispatches pre-configured chemical combinations to the `labStore` and directly navigates the user to the lab.

### 10. Explicit Dark Mode Toggle — Priority: LOW | Effort: SMALL
**What:** A UI toggle for light/dark mode.
**Why:** Expected standard in modern student tools to reduce eye strain during extended lab sessions.
**Where in code:** `client/src/components/Navbar.jsx`
**How:** Add a toggle in the Navbar that updates a `theme` class on the `body` and persists the preference to `localStorage`.

## Quick Wins (< 1 day each)
1. **Lab History CSV Export:** Can be added immediately to the existing history page using basic JavaScript Blob logic.
2. **Teacher Analytics Data Export:** Reusing the same CSV logic for the teacher dashboard.
3. **Keyboard Shortcuts for Lab Equipment:** A single `useEffect` hook in `Lab3D.jsx` mapping keystrokes to existing Zustand actions.
