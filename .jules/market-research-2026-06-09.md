# Market Research Report
**App:** Alchemistry - A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-06-09
**Competitors Researched:** Labster, Explore Learning Gizmos, PhET Interactive Simulations, Futuclass

## Executive Summary
The virtual chemistry lab space is highly focused on combining realistic simulations with structured learning and assessment tools. Top products like Labster and Explore Learning Gizmos excel by offering guided, curriculum-aligned experiences and robust teacher dashboards. While Alchemistry has an impressive 3D interactive lab and basic teacher analytics, it lacks onboarding tutorials, integrated quizzes/assessments, and data export features that are table stakes for educational platforms. Adding these features will bridge the gap to top-tier competitors and provide a more structured learning experience.

## Competitor Analysis
* **Labster:** The industry leader. Offers highly realistic 3D simulations with built-in quizzes, curriculum alignment, and comprehensive teacher analytics. Differentiates with a gamified storyline approach.
* **Explore Learning Gizmos:** Focuses strongly on K-12 curriculum alignment with ready-made lesson plans, vocabulary support, and teacher resources. Visuals are simpler but highly practical for classroom use.
* **PhET Interactive Simulations:** Free, browser-based, open-ended sandboxes. Highly accessible but lacks structured learning paths or built-in assessments.
* **Futuclass:** VR-focused with gamified chemistry puzzles (5-10 min modules) designed for high engagement. Offers instant feedback and teacher guides.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Data Export:** Teachers need to download student progress and experiment results for external gradebooks. (Missing from `TeacherDashboard.jsx` and `ClassroomDetail.jsx`).
* **Guided Onboarding:** First-time users need a walkthrough to understand how to interact with the 3D environment. (Alchemistry currently only has static keyboard instructions in `Lab3D.jsx`).

### Differentiating Opportunities (Stand-out features)
* **In-Experiment Quizzes:** Top platforms integrate assessment *during* the experiment to check understanding, not just at the end. (Alchemistry logs results but lacks active questioning).
* **Pre-made Lesson Plans:** Providing teachers with structured assignments rather than just free-play in the lab.

### UX Patterns (Design/interaction patterns common in top products)
* **Contextual Tooltips:** Highlighting interactable elements (beakers, burners) when the user hovers or when it's the next step in a guided experiment.

## Prioritised Recommendations

### 1. Add CSV Export for Teacher Analytics — Priority: HIGH | Effort: SMALL
**What:** A button for teachers to export student experiment results and scores to a CSV file.
**Why:** Table stakes for any EdTech tool. Teachers need this data for their school's primary grading system (LMS/SIS).
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/pages/ClassroomDetail.jsx`.
**How:** Add an "Export CSV" button that takes the existing React Table data (`table.getRowModel().rows`) or raw query data, formats it into a CSV string, and triggers a file download using a Blob and `<a>` tag.

### 2. Implement Interactive Lab Onboarding Tutorial — Priority: HIGH | Effort: MEDIUM
**What:** A guided, step-by-step tutorial overlay for first-time users entering the 3D lab.
**Why:** Competitors like Labster provide clear guidance. Relying on static text (`.keyboard-instructions`) leads to high abandonment.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `client/src/components/LabTutorial.jsx`.
**How:** Create a state variable `hasSeenTutorial` (stored in `localStorage` or `user_settings` table). If false, render a sequence of overlay tooltips highlighting the chemical selection, action buttons, and reaction initiation.

### 3. In-Experiment Concept Checks (Quizzes) — Priority: MEDIUM | Effort: LARGE
**What:** Short, multiple-choice questions that pop up during or immediately after a specific reaction.
**Why:** Transforms the app from a simple sandbox (like PhET) to a structured learning tool (like Labster). Ensures students understand *why* a reaction occurred.
**Where in code:** `client/src/store/labStore.js` and `client/src/components/ResultModal.jsx`.
**How:** Extend the `experiments` database table/data to include `concept_question` and `options`. After `initiateReaction()`, display the quiz before or alongside the `ResultModal.jsx`.

## Quick Wins (< 1 day each)
1. **CSV Export Button:** Implementing standard browser-based CSV generation in the Teacher Dashboard.
2. **Contextual Tooltips for 3D Objects:** Adding `title` or a simple HTML overlay tooltip when hovering over Three.js objects (Beaker, Flask) using `@react-three/drei`'s `Html` component.
3. **Empty State Enhancements:** Improve `EmptyState.jsx` in the Teacher Dashboard to include a link to "How to invite students" or documentation.
