# Market Research Report
**App:** A 3D virtual chemistry lab that allows students to mix chemicals, observe reactions, and learn safely via interactive WebGL simulations.
**Market:** EdTech Virtual Science Labs
**Date:** 2025-04-25
**Competitors Researched:** Labster, PraxiLabs, Futuclass, PhET Interactive Simulations

## Executive Summary
The EdTech Virtual Science Lab market is transitioning from unstructured sandbox environments to structured, guided learning platforms with strong instructor visibility. The Alchemistry app has a solid WebGL foundation for mixing chemicals but lacks the guided instructional layer and formative assessment loops found in top-tier platforms. The greatest opportunities for Alchemistry are implementing in-simulation guidance (scenarios) and providing granular, action-level analytics to educators to track student methodology, not just completion.

## Competitor Analysis
- **Labster:** The market leader. Differentiates via highly structured, gamified "missions" with strong narrative wrappers and continuous multiple-choice knowledge checks during the simulation.
- **PraxiLabs:** Focuses heavily on realism and protocol adherence. Differentiates with a strong "Hint" and "Guide" system that prevents students from getting stuck without providing direct answers.
- **Futuclass:** A rising VR/3D entrant focusing on shorter, concept-specific modules (e.g., balancing equations) rather than full open-world labs. High emphasis on immediate visual feedback.
- **PhET Interactive Simulations:** The free, open-source standard. Excels at unguided exploration but relies entirely on external teacher-provided worksheets for curriculum integration.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
- **In-simulation Instructions:** A persistent UI panel guiding the student through the required steps of an experiment.
- **Formative Assessment:** Small quizzes or checks for understanding presented *during* the reaction or immediately after, before moving to the next step.

### Differentiating Opportunities (Stand-out features)
- **Granular Methodology Analytics:** Tracking *how* a student arrived at an answer (e.g., number of failed mixtures, time spent combining specific elements) rather than just final grades.
- **Dynamic Hints:** Context-aware nudges based on what items a student is currently dragging/holding in the 3D space.

### UX Patterns (Design/interaction patterns common in top products)
- **Split-Screen Layouts:** 3D environment on one side (70% width), textual instructions/questions on a side panel (30% width).
- **Reaction Replay:** The ability to "undo" or replay a specific chemical combination to re-observe the visual effect without restarting the whole scenario.

## Prioritised Recommendations

### 1. Guided Scenario Panel — Priority: HIGH | Effort: MEDIUM
**What:** A sidebar component within the 3D lab that presents step-by-step instructions (e.g., "Step 1: Combine Sodium and Water").
**Why:** Transitioning from a pure sandbox to a structured learning tool is the #1 request from teachers using virtual labs, as seen in Labster's success.
**Where in code:** `client/src/pages/Lab3D.jsx` (Add a `ScenarioSidebar` component alongside the canvas).
**How:** Create a new state piece `currentStep` and a UI overlay that updates based on the current `reactions` array length or specific combinations achieved.

### 2. Formative Result Quizzes — Priority: HIGH | Effort: SMALL
**What:** Add a quick "Why did this happen?" multiple-choice question when a reaction completes successfully.
**Why:** Active recall immediately following observation drastically improves retention.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Extend the modal to include a `QuizBox` component if the current result triggers a specific state change, requiring an answer before dismissal.

### 3. Methodology Analytics Tracking — Priority: MEDIUM | Effort: SMALL
**What:** Log incorrect combinations or "near misses" and send them to the backend, rather than just logging successful experiments.
**Why:** Teachers need to see where students are struggling, not just what they got right.
**Where in code:** `client/src/store/historyStore.js` and the `onDrop` handler in `Lab3D.jsx`.
**How:** Update the zustand store to track a `failedAttempts` array per session, and send this payload during the existing `saveExperiment` API call.

### 4. Interactive Hint System — Priority: MEDIUM | Effort: MEDIUM
**What:** A "Need Help?" button that provides contextual hints based on the active items in the workspace.
**Why:** Prevents student frustration and reduces the "guess and check" behavior common in sandbox labs.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `HintButton` overlay. When clicked, it checks the currently selected/active `labEquipment` and provides a string hint from a predefined dictionary.

### 5. Detailed Student Dashboard View — Priority: HIGH | Effort: MEDIUM
**What:** Expand the teacher dashboard to view individual student progress graphs and specific experiment logs.
**Why:** Current implementation only provides high-level analytics. Teachers need granular data to intervene effectively.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Add a modal or expanding row to the `useReactTable` implementation that fetches and displays the detailed `historyStore` logs for a specific `studentId`.

## Quick Wins (< 1 day each)
1. **Formative Result Quizzes:** Can be added to the existing `ResultModal` with static questions mapped to known reaction formulas.
2. **Methodology Analytics Tracking:** Requires only a small expansion of the existing Zustand store and API payload.
3. **Interactive Hint System:** Can be implemented as a simple static lookup table based on current inventory state before building complex context-awareness.
