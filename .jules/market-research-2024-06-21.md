# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive 3D experiments and classroom management.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-06-21
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual science lab market is dominated by platforms that blend immersive 3D simulations with structured pedagogy. While Alchemistry excels at providing a visually engaging 3D environment for chemical reactions, top competitors differentiate themselves by tightly coupling these simulations with assessment, guided learning pathways, and comprehensive analytics. The biggest opportunity for Alchemistry is to bridge the gap between "sandbox exploration" and "structured learning" by introducing quizzes, guided tutorials, and exportable data.

## Competitor Analysis
- **Labster:** Focuses on immersive, gamified 3D environments with strong narrative elements. Key differentiators include built-in quizzes, automated checkpoints, and real-world problem-solving contexts.
- **PraxiLabs:** Offers highly interactive 3D labs with a strong emphasis on assessment and LMS integration. Key features include an AI lab assistant, custom quiz builders, and real-time performance analytics.
- **PhET Interactive Simulations:** Provides free, highly accessible 2D/3D simulations focusing on cause-and-effect exploration. Key strengths are implicit guidance (limiting controls to focus learning) and extensive teacher-contributed activities.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **In-Lab Assessments:** Both Labster and PraxiLabs feature quizzes tied directly to simulations to test comprehension. Alchemistry currently lacks any assessment mechanism.
- **Data Export:** Teachers need to export student performance and experiment logs.
- **Guided Tutorials/Onboarding:** Top platforms provide step-by-step guidance for first-time users.

### Differentiating Opportunities (Stand-out features)
- **Gamified Progression:** Tying experiment completion to XP/badges (partially implemented in TeacherDashboard but needs expansion in the student journey).
- **Customizable Scenarios:** Allowing teachers to define specific required chemical combinations for an assignment.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Hints:** Providing hints when users make incorrect combinations (Alchemistry has a foundation for this with `currentHint` in `labStore`).
- **Instant Feedback Modals:** Showing detailed scientific explanations alongside visual results.

## Prioritised Recommendations

### 1. Post-Experiment Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** A short quiz modal that appears after a successful reaction to test understanding.
**Why:** Assessment is a core feature of all major competitors (Labster, PraxiLabs) and validates that the student learned the underlying chemistry, not just how to mix colors.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/Lab3D.jsx`.
**How:** Add a "Take Quiz" button to the `ResultModal`. When clicked, transition to a new `QuizModal` component with predefined questions based on the `reactionResult`. Store quiz scores in a new Supabase table.

### 2. Export Experiment Logs to CSV — Priority: HIGH | Effort: SMALL
**What:** A button to export the student's experiment history to a CSV file.
**Why:** Table-stakes feature for educational tools, allowing students to submit data for assignments and teachers to review offline.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Add an `ExportButton` component that uses Papa Parse (or simple string manipulation) to convert the `logs` array from `useHistoryStore` into a downloadable CSV file.

### 3. Interactive Lab Tutorial/Onboarding — Priority: MEDIUM | Effort: MEDIUM
**What:** A guided, step-by-step overlay for first-time users in the 3D lab.
**Why:** Top platforms (PraxiLabs) use guided tutorials to reduce friction. Alchemistry's 3D interface may be unintuitive for new users.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `TutorialOverlay.jsx` component.
**How:** Implement a state flag (`hasSeenTutorial`) in local storage. If false, display a sequence of tooltips pointing to the chemical controls, the 3D canvas, and the "Initiate Reaction" button using a library like `react-joyride` or custom CSS overlays.

### 4. Teacher Assignment Builder — Priority: MEDIUM | Effort: LARGE
**What:** Allow teachers to create specific assignments with required reactions.
**Why:** PraxiLabs and Labster allow instructors to align labs with curriculum. Currently, Alchemistry is primarily a sandbox.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`, `ClassroomDetail.jsx`, and a new `store/assignmentStore.js`.
**How:** Add an interface for teachers to create assignments (e.g., "Synthesize NaCl"). Students see pending assignments on their `StudentDashboard.jsx`.

### 5. Enhanced Contextual Hints — Priority: LOW | Effort: SMALL
**What:** Display science-based hints when a user mixes an invalid or non-reactive combination.
**Why:** PhET and Labster provide instant, constructive feedback for mistakes.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`.
**How:** Expand the `deriveThermalState` or `initiateReaction` logic to set a specific `currentHint` when the reaction yields no result, and display this hint prominently in the UI.

## Quick Wins (< 1 day each)
1. **Export Experiment Logs to CSV:** Easily implementable in `history.jsx` using existing data.
2. **Enhanced Contextual Hints:** Small logic updates in `labStore.js` to provide better feedback on failed reactions.
3. **Add "Learning Objectives" to Dashboard:** Update `StudentDashboard.jsx` to show static learning goals for each module.
