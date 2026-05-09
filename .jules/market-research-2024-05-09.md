# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory built with React and Three.js for students to conduct safe, interactive experiments with an AI tutor.
**Market:** Interactive Science Education / Virtual Laboratory Simulators (EdTech).
**Date:** 2024-05-09
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

## Executive Summary
The interactive virtual laboratory market is moving from simple flash-style click-throughs to highly immersive, gamified 3D sandbox environments. Top platforms like Labster and Beyond Labz excel at providing deep analytics for educators, guided inquiry (interactive lab manuals), and extensive post-experiment data tools (lab notebooks). Alchemistry currently has a solid 3D sandbox and a unique AI tutor integration, but it lacks the structured guidance and data-export features expected in this space. Implementing a guided experiment mode and a lab notebook feature will bridge the gap between a pure sandbox and an effective educational tool.

## Competitor Analysis
*   **Labster:** The market leader, known for highly gamified, story-driven simulations. Key differentiator: Deeply integrated quizzes and guided narratives that prevent students from getting stuck.
*   **PraxiLabs:** Focuses on realistic, curriculum-aligned lab procedures. Key differentiator: Detailed LMS integrations and robust performance tracking for educators.
*   **Beyond Labz:** Focuses on open-ended sandbox environments with strong post-experiment data collection. Key differentiator: The "Lab Book" feature, allowing students to record raw data, graphs, and observations.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Lab Notebook:** A way to record qualitative and quantitative observations beyond a simple log.
*   **Guided Experiment Mode:** Step-by-step instructions overlaying the 3D environment for complex procedures.
*   **Data Export:** The ability to download experiment results for submission.

### Differentiating Opportunities (Stand-out features)
*   **Contextual AI Hinting:** Expanding the existing `AiTutorPanel` to proactively offer hints based on the student's current chemical mixture before they hit "Initiate Reaction".
*   **Gamified Achievements/Badges:** Visual rewards for successful discoveries.

### UX Patterns (Design/interaction patterns common in top products)
*   **In-scene Tooltips:** Labels and safety warnings attached directly to 3D objects in the scene.
*   **Progress Indicators:** Clear visual cues showing how far along a student is in a specific assignment.

## Prioritised Recommendations

### 1. Contextual "Lab Manual" Overlay — Priority: HIGH | Effort: MEDIUM
**What:** Add a dismissible side panel containing step-by-step instructions for specific assignments in the 3D lab.
**Why:** Top competitors (Labster, PraxiLabs) guide students through procedures. Alchemistry is currently a pure sandbox, which can be overwhelming.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `LabManualPanel.jsx` component.
**How:** Create a slide-out panel linked to the active assignment data fetched in `StudentDashboard.jsx`.

### 2. Export History as CSV/PDF — Priority: HIGH | Effort: SMALL
**What:** Add an "Export Log" button to the History page.
**Why:** Standard in educational tools (Beyond Labz). Students need to submit evidence of their work, and teachers need offline records.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a button that maps the `logs` array from `useHistoryStore` to CSV format using standard browser Blob APIs.

### 3. Proactive AI Tutor Hints — Priority: MEDIUM | Effort: SMALL
**What:** Trigger the AI tutor button to pulse or show a small tooltip when the student's current chemical mix (`chemA`, `chemB`, etc.) is unlikely to produce a meaningful reaction.
**Why:** Leverages existing AI capabilities to prevent frustration, similar to Labster's guided feedback.
**Where in code:** `client/src/pages/Lab3D.jsx` (watch `chemA`, `chemB`, etc., state changes).
**How:** Add a `useEffect` that checks the ratios and sets a "hint available" state, modifying the `ai-toggle-button` class to draw attention.

### 4. Interactive "Lab Book" Notes — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow students to add personal text notes to their experiment logs.
**Why:** Essential for science education (Beyond Labz core feature). Observations are as important as the outcome.
**Where in code:** `client/src/components/ResultModal.jsx` and `history.jsx`
**How:** Add a textarea to the `ResultModal` for notes, save it to the `history` table in Supabase, and display it in the history list.

### 5. In-Scene Chemical Labels — Priority: LOW | Effort: SMALL
**What:** Add 3D text or HTML overlay labels to the beakers/flasks in the 3D canvas.
**Why:** Reduces cognitive load. Users currently rely on the sliders panel; seeing labels on the actual objects mimics a real lab.
**Where in code:** `client/src/pages/Lab3D.jsx` (inside the `<PhysicsLab>` or `<Canvas>`).
**How:** Use `@react-three/drei`'s `<Html>` or `<Text>` components to attach labels to the chemical props.

## Quick Wins (< 1 day each)
1.  **Export History as CSV:** Simple frontend mapping of existing state.
2.  **Proactive AI Tutor Hints:** Minor state logic addition to `Lab3D.jsx`.
3.  **Interactive "Lab Book" Notes:** Basic UI update to `ResultModal` and database schema tweak.
