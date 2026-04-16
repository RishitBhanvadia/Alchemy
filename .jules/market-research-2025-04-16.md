# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment under teacher supervision.
**Market:** Educational Technology (EdTech) - Virtual Lab Simulations
**Date:** 2025-04-16
**Competitors Researched:** Labster, PraxiLabs

## Executive Summary
The virtual chemistry lab market is highly focused on institutional adoption, meaning features must serve both the student (engagement, realism, safety) and the teacher/institution (assessment, tracking, LMS integration). Top competitors like Labster and PraxiLabs heavily emphasize interactive assessments, gamified learning, and detailed progress analytics. While Alchemistry has strong core 3D simulation, role-based dashboards, and assignment tracking (`assignmentStore.js`), it lacks embedded assessments and safety protocol simulations which are table-stakes in this market.

## Competitor Analysis
*   **Labster:** Focuses on immersive 3D simulations with built-in learning narratives (e.g., escape rooms). Strong emphasis on quiz questions directly embedded within the simulation flow and LMS integrations.
*   **PraxiLabs:** Offers diverse chemistry experiments (Organic, Inorganic, Analytical) with an "AI Lab Assistant" (Oxi) and a robust custom quiz builder for educators. Strong focus on real-time performance analytics and risk-free environments.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Embedded Quizzes/Assessments:** Competitors require students to answer questions during or immediately after an experiment to prove understanding, not just mix chemicals.
*   **Safety Protocol Simulation:** Competitors force students to "put on PPE" or acknowledge safety rules before starting virtual experiments.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Narratives:** Turning standard experiments (like titration) into challenges (e.g., "Identify the unknown substance to unlock the next level").
*   **Comprehensive LMS Export:** While Alchemistry has analytics, the ability to export these specific grades to standard LMS formats (Canvas/Blackboard) is crucial for institutional sales.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual AI Guidance:** PraxiLabs uses "Oxi". Alchemistry has `AiTutorPanel.jsx`, but it needs to proactively intervene when students make consecutive errors, rather than just waiting for prompts.
*   **Step-by-Step Checklists:** Persistent UI showing the remaining steps of the current experiment to prevent cognitive overload.

## Prioritised Recommendations

### 1. In-Simulation Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Add multiple-choice quiz questions that pop up at key moments during 3D experiments.
**Why:** Assessment is the primary way institutions measure the ROI of virtual labs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/ResultModal.jsx`.
**How:** Expand the `ResultModal` to include an optional "Knowledge Check" view. Store quiz scores via the existing `submitAssignment` function in `client/src/store/assignmentStore.js`.

### 2. Safety Protocol Pre-Check — Priority: HIGH | Effort: SMALL
**What:** Require students to click through a brief safety checklist (PPE, fume hood usage) before the 3D canvas becomes interactive.
**Why:** Table stakes for chemistry education software; reinforces real-world safety habits even in virtual environments.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a modal overlay on initial load. The canvas (`<PhysicsLab />`) remains disabled or blurred until the student accepts the safety terms.

### 3. Proactive AI Tutor Interventions — Priority: MEDIUM | Effort: MEDIUM
**What:** The `AiTutorPanel` should auto-trigger a hint if a student fails an experiment (e.g., an explosion) multiple times in a row.
**Why:** Matches the "AI Lab Assistant" feature seen in PraxiLabs to prevent student frustration.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/AiTutorPanel.jsx`.
**How:** Track failed attempts in local component state. If `failCount >= 2`, automatically set `isAiOpen(true)` and pass a contextual failure prompt to the AI store.

### 4. Step-by-Step Task Checklist UI — Priority: MEDIUM | Effort: SMALL
**What:** A persistent, collapsible sidebar or widget showing the steps needed to complete the current assignment.
**Why:** Reduces cognitive overload for complex organic or inorganic chemistry procedures.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Create a new `TaskChecklist.jsx` component. Pass the current assignment instructions from `useAssignmentStore` and render them as checkable items.

### 5. CSV Grade Export for Teachers — Priority: LOW | Effort: SMALL
**What:** Allow teachers to download a CSV of student assignment scores.
**Why:** A stepping stone to full LMS integration, which is critical for B2B sales.
**Where in code:** `client/src/components/ClassroomManager.jsx` or `client/src/pages/TeacherDashboard.jsx`.
**How:** Add an "Export Grades" button that pulls data from `studentProgress` in `assignmentStore.js` and formats it as a downloadable CSV.

## Quick Wins (< 1 day each)
1.  **Safety Protocol Pre-Check:** Simple React modal to block interaction until acknowledged.
2.  **CSV Grade Export:** Easy string manipulation of existing store data into a downloadable Blob.
3.  **Proactive AI Warnings:** Basic counter state tied to the existing `reactionResult` failure state.