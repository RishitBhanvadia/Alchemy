# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive, safe student experiments.
**Market:** EdTech / Virtual Lab Simulations (Middle & High School Chemistry)
**Date:** 2024-05-24
**Competitors Researched:** Labster, Futuclass, PhET Interactive Simulations, Gizmos by ExploreLearning

## Executive Summary
The virtual chemistry lab market is transitioning from purely open-ended sandboxes to structured, gamified learning experiences. While Alchemistry has a strong technical foundation with its 3D environment and AI tutor, it currently lacks the guided experimentation and structured lesson flows that market leaders like Labster and Futuclass use to keep students engaged and aligned with curriculum standards. The biggest opportunity is to wrap the existing open sandbox in guided "missions" and enhance the teacher's ability to monitor real-time progress.

## Competitor Analysis
- **Labster:** The market leader. Focuses on immersive, gamified simulations with guided narratives and built-in assessments. Very structured.
- **Futuclass:** VR/PC based, gamifies chemistry into short 5-10 minute puzzles (e.g., balancing equations, building molecules). High engagement.
- **PhET Interactive Simulations:** Free, highly accessible, focuses on specific concepts (e.g., balancing equations, concentration). More open-ended but often used with teacher worksheets.
- **Gizmos:** Focuses heavily on standards-aligned lessons with built-in student activities and teacher dashboards.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Guided Experiments:** Step-by-step instructions overlaid on the lab environment (currently only has an AI hint system).
- **In-App Assessments/Quizzes:** Checking understanding before/during/after the reaction.
- **Save/Load States:** Ability to pause an experiment and return later.

### Differentiating Opportunities (Stand-out features)
- **Gamified "Missions":** Restricting the sandbox to solve specific puzzles (e.g., "Create a neutral solution").
- **Accessibility Modes:** High contrast, colorblind support for chemical indicators.

### UX Patterns (Design/interaction patterns common in top products)
- **Objective Tracker:** A persistent UI element showing current tasks/goals.
- **Interactive Tooltips/Onboarding:** Explaining the UI on first use.

## Prioritised Recommendations

### 1. Guided "Mission" Mode — Priority: HIGH | Effort: MEDIUM
**What:** Add a structured learning mode where students are given a specific goal (e.g., "Neutralize the acid").
**Why:** Competitors like Futuclass and Labster thrive on structured puzzles, which keeps students focused and aligns with lesson plans better than an open sandbox.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `currentMission` state to the store. Display a persistent UI overlay in `Lab3D.jsx` showing the goal. Validate the `reactionResult` against the mission criteria.

### 2. Pre/Post-Reaction Knowledge Checks — Priority: HIGH | Effort: SMALL
**What:** Inject a small multiple-choice question before allowing the reaction to initiate, or right after showing the result.
**Why:** Teachers need assurance that students understand *why* a reaction happened, not just that they clicked a button. Labster heavily utilizes this.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/Lab3D.jsx` (handlePlayClick)
**How:** Add a modal intercept before `initiateReaction()` or extend `ResultModal` to include a quiz component based on the chemicals used.

### 3. Interactive First-Time Onboarding — Priority: MEDIUM | Effort: SMALL
**What:** A step-by-step walkthrough highlighting the chemical sliders, history panel, and AI tutor button on first visit.
**Why:** While the app has instructions, top tools use contextual tooltips to reduce cognitive load for new students.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use a library like `react-joyride` or build a simple overlay component that checks a `hasSeenOnboarding` flag in localStorage.

### 4. Colorblind Mode for Indicators — Priority: MEDIUM | Effort: SMALL
**What:** Add a toggle to display text labels or patterns alongside color changes for chemical indicators (like BTB).
**Why:** Accessibility is a major selling point for educational software in institutional sales.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (assuming this handles visual output) and `client/src/app.css` (or `accessibility.css`)
**How:** Add an accessible text overlay or pattern texture to the 3D liquid material when a colorblind toggle is active in user settings.

### 5. Enhanced Teacher Analytics Dashboard — Priority: MEDIUM | Effort: MEDIUM
**What:** Upgrade the teacher dashboard to show not just that an experiment was run, but how many attempts it took to get it right.
**Why:** Tools like Gizmos provide deep insights into student struggle points, not just completion.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `server/controllers/resultController.js`
**How:** Track failed attempts (e.g., reactions resulting in generic mixtures) per student in the database and visualize this ratio on the teacher dashboard.

### 6. "Recipe Book" / Known Reactions Guide — Priority: LOW | Effort: SMALL
**What:** An in-game manual detailing available chemicals and theoretical reactions.
**Why:** Gives students a reference point within the app, reducing the need to look up formulas elsewhere, keeping them engaged in the platform.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a sliding panel (similar to the history panel) that lists discovered reactions and locked/unlocked chemical combinations.

### 7. Export Results to CSV/PDF — Priority: LOW | Effort: SMALL
**What:** Allow students to export their experiment history for submission in assignments.
**Why:** Standard feature in tools like PhET when used in formal education settings.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export" button that takes the `historyLogs` array and formats it into a CSV using a simple utility function.

### 8. Reaction Speed Control (Time Dilation) — Priority: LOW | Effort: MEDIUM
**What:** Allow students to slow down or speed up the 3D reaction animation.
**Why:** Helps visualize rapid reactions better, a common feature in PhET simulations.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Add a time-scale modifier to the 3D animation loop or GSAP timelines.

### 9. Shareable Experiment States — Priority: LOW | Effort: MEDIUM
**What:** Generate a unique link that loads the lab with specific chemical concentrations preset.
**Why:** Allows teachers to easily distribute a starting state for an assignment.
**Where in code:** `client/src/pages/Lab3D.jsx` and React Router
**How:** Parse query parameters (e.g., `?a=50&b=20`) on mount and update `labStore`.

### 10. Pause/Resume Functionality — Priority: LOW | Effort: LARGE
**What:** Ability to pause a long-running reaction mid-way.
**Why:** Useful for classroom environments where the bell rings unexpectedly.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Requires significant refactoring of the animation and state management to support pausing the physics/render loop.

## Quick Wins (< 1 day each)
1. **Interactive First-Time Onboarding:** Implement a simple `hasSeenOnboarding` flag and tooltip for new users.
2. **Export Results to CSV/PDF:** Add an export button to the History page.
3. **Shareable Experiment States:** Parse URL query params on `Lab3D` mount to preset sliders.
