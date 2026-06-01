# Market Research Report
**App:** Alchemistry is a browser-based virtual chemistry laboratory built with React and Three.js that allows students to safely conduct 3D chemistry experiments, with teacher dashboard management and history tracking.
**Market:** EdTech Virtual Science Laboratories
**Date:** 2024-05-18
**Competitors Researched:** Labster, PhET Interactive Simulations, Gizmos by ExploreLearning, Khan Academy (Interactive Practice)

## Executive Summary
The virtual lab software market is shifting from open-ended sandbox environments to structured, guided simulation platforms that integrate assessment directly into the student experience. Top competitors like Labster and Gizmos thrive by providing real-time data tracking inside the lab environment and structured teacher-assigned investigations. Alchemistry already has a strong 3D sandbox and basic assignment/history tracking, but lacks the bridge between them. The biggest opportunity is to integrate guided instructions and real-time assignment completion directly into the 3D lab view.

## Competitor Analysis
* **Labster:** Market leader in guided simulations. Differentiator is step-by-step procedures with measurable data generated inside the virtual lab, keeping learners in a single activity loop.
* **PhET Interactive Simulations:** Strongest in free, low-friction classroom exploration. Differentiator is real-time variable control with immediate measurement readouts.
* **Gizmos by ExploreLearning:** Focuses on teacher-assigned activities. Differentiator is instant visual updates (graphs, tables) as students manipulate variables.
* **Khan Academy:** Best for mastery tracking. Differentiator is immediate, step-by-step feedback and hints tied to specific learning objectives.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Guided Lab Procedures:** Students need step-by-step instructions visible *while* conducting the experiment, rather than just an open sandbox.
* **Real-time Assessment:** Checking if a specific reaction outcome matches an assignment goal immediately.

### Differentiating Opportunities (Stand-out features)
* **Real-time Graphing/Data Visualization:** Showing live charts as chemical concentrations are adjusted (like Gizmos).
* **Mastery Tracking Dashboards:** Giving students visibility into their skill mastery across different reaction types.

### UX Patterns (Design/interaction patterns common in top products)
* **In-lab Assignment Panels:** A persistent UI panel inside the simulation showing current objectives and progress.
* **Immediate Feedback Modals:** Instant hints or corrections if a student mixes the wrong chemicals during a guided task.

## Prioritised Recommendations

### 1. In-Lab Assignment Objectives Panel — Priority: HIGH | Effort: SMALL
**What:** Add a persistent UI panel in the `Lab3D` view that displays the student's active assignment objectives.
**Why:** Competitors like Labster succeed by keeping students in a single activity loop. Currently, Alchemistry students must leave the lab to check assignments.
**Where in code:** `client/src/pages/Lab3D.jsx`, `client/src/store/assignmentStore.js`
**How:** Create an `ActiveAssignmentPanel` component that reads from `assignmentStore` and displays the goals overlaid on the 3D canvas.

### 2. Auto-grading Lab Submissions — Priority: HIGH | Effort: MEDIUM
**What:** Automatically trigger `submitAssignment` when a successful reaction matches the criteria of an active assignment.
**Why:** Reduces friction and mimics the instant assessment of platforms like Gizmos.
**Where in code:** `client/src/pages/Lab3D.jsx` (inside `reactionResult` handling)
**How:** Add logic in `Lab3D.jsx` that compares the `reactionResult` (e.g., `outcome_label`) with the active assignment requirements and calls `assignmentStore.submitAssignment()`.

### 3. Real-time Measurement Readouts — Priority: MEDIUM | Effort: MEDIUM
**What:** Add dynamic visual feedback (e.g., a simulated pH meter or temperature gauge) that updates instantly as sliders change.
**Why:** PhET and Gizmos excel because students see immediate data changes before the reaction even finalizes.
**Where in code:** `client/src/pages/Lab3D.jsx` (slider UI area), new `components/MeasurementTools.jsx`
**How:** Create a UI component that interpolates a rough pH or temperature value based on the current `chemA` (acid) and `chemB` (base) state values.

### 4. Step-by-Step Guided Mode — Priority: MEDIUM | Effort: LARGE
**What:** Introduce a "Guided Lab" mode that disables certain sliders until previous steps are completed correctly.
**Why:** Labster's core differentiator is structured, guided protocols that prevent students from getting lost.
**Where in code:** `client/src/pages/Lab3D.jsx`, `client/src/store/labStore.js`
**How:** Add a `guidedMode` state to `labStore`. When active, conditionally disable sliders in `Lab3D.jsx` based on the current step index.

### 5. Interactive Hints via AI Tutor — Priority: LOW | Effort: SMALL
**What:** Pre-fill the `AiTutorPanel` prompt with context about the student's recent failed reactions.
**Why:** Khan Academy provides immediate, contextual hints. Alchemistry has an AI tutor, but it requires manual prompting.
**Where in code:** `client/src/components/AiTutorPanel.jsx`, `client/src/pages/Lab3D.jsx`
**How:** Pass the most recent `reactionResult` (if error) as a prop to `AiTutorPanel` to formulate a context-aware initial greeting or hint.

## Quick Wins (< 1 day each)
1. Add an In-Lab Assignment Objectives Panel (Recommendation 1)
2. Implement Auto-grading for matching reactions (Recommendation 2)
3. Pass context to AI Tutor for smart hints (Recommendation 5)
