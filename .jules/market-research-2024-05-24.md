# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment while teachers monitor their progress.
**Market:** Virtual STEM Education Software / EdTech Simulators
**Date:** 2024-05-24
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

## Executive Summary
The virtual science lab market is driven by the need for safe, scalable, and immersive STEM education. Top competitors differentiate themselves through deep LMS integrations, structured student assessment (lab manuals/quizzes), and comprehensive educator analytics. Alchemistry has a strong core with its 3D simulations and basic role management, but it currently lacks the structured reporting and robust analytics export features expected by educators in this space. By focusing on enhancing teacher tools and adding structured student reflection, Alchemistry can significantly improve its competitive positioning.

## Competitor Analysis
*   **Labster:** The market leader, known for high-quality, story-driven 3D simulations. Strong focus on gamification, immediate feedback, and deep LMS integrations.
*   **PraxiLabs:** Focuses on realistic lab simulations across physics, chemistry, and biology. Key differentiators include localized content (e.g., Arabic), interactive tutorials, and a strong assessment system with multiple-choice questions and model answers.
*   **Beyond Labz:** Provides open-ended virtual labs across multiple science disciplines. A major feature is their inclusion of "lab books" for students to record procedures, data, and submit results, mimicking a real-world lab notebook experience.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export for Educators:** Teachers need to export grades and analytics to their school's LMS or gradebook. Alchemistry currently lacks a CSV/PDF export feature for student scores and activity.
*   **Structured Lab Notebooks/Reports:** Students need a place to log qualitative observations, answer questions, and submit a formal "report" for an assignment, not just a system-generated score.
*   **Guided Tutorials/Onboarding:** While Alchemistry has hints, it lacks a dedicated, interactive onboarding flow for the 3D environment to ensure students understand the controls and objectives before starting.

### Differentiating Opportunities (Stand-out features)
*   **Customizable Assessments:** Allowing teachers to create custom multiple-choice questions or reflection prompts tied to specific experiments.
*   **Peer Collaboration/Observation:** While multiplayer might be complex, allowing students to share their experiment logs or "lab books" with peers for review could be a unique lightweight feature.

### UX Patterns (Design/interaction patterns common in top products)
*   **Split-pane Views:** Often, the 3D simulation is on one side, and the lab notebook/instructions are on the other, allowing students to read and experiment simultaneously without losing context.
*   **Contextual Tooltips:** Extensive use of tooltips on laboratory equipment to explain its function upon first interaction.

## Prioritised Recommendations

### 1. Data Export for Teachers (CSV) — Priority: HIGH | Effort: SMALL
**What:** Add an "Export to CSV" button on the Teacher Dashboard to download student analytics (XP, Badges, Experiments Completed, Last Active).
**Why:** Table stakes for any EdTech tool. Teachers must integrate this data into their official gradebooks (like Canvas or Google Classroom).
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`.
**How:** Add a button near the search bar or analytics section that uses a simple CSV generation utility (like `papaparse` or native JS Blob) to export the `students` state data.

### 2. Structured "Lab Notebook" Modal — Priority: HIGH | Effort: MEDIUM
**What:** Add a text area or structured form to the `ResultModal` where students can add their own "observations" or "notes" before finalizing the experiment log.
**Why:** Competitors like Beyond Labz heavily emphasize the "lab book" aspect. It moves the tool from just a "game" to a true educational assessment.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/store/labStore.js` / backend `experiment_logs` table.
**How:** Add a `notes` field to the `experiment_logs` table. Update the UI in `ResultModal` to include an optional text area for students to write notes before clicking "Save & Close".

### 3. In-Lab Sidebar for Instructions — Priority: MEDIUM | Effort: MEDIUM
**What:** Implement a collapsible sidebar within the 3D lab view that displays the current assignment details or general instructions, rather than relying solely on toasts or separate pages.
**Why:** UX pattern from competitors. Students need to see what they are supposed to do *while* they are in the 3D environment, without switching tabs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/sidebar.jsx` (or a new component).
**How:** Create a floating, collapsible panel over the `Canvas` that fetches and displays the user's active assignment for that experiment type.

### 4. Teacher View of Student Logs — Priority: MEDIUM | Effort: SMALL
**What:** Allow teachers to click on a student in the data grid to view their detailed experiment history (the same view the student sees in `/history`).
**Why:** Teachers need granular data to see *where* a student is struggling, not just their total score or XP.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/pages/history.jsx` (or a new modal component).
**How:** Make the rows in the teacher data grid clickable, opening a modal that fetches and displays that specific `student_id`'s `experiment_logs`.

### 5. Contextual Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Add hover tooltips or "info" buttons next to the chemical sliders in the 3D lab that briefly explain what the chemical is (e.g., "Hydrochloric Acid (HCl): A strong corrosive acid").
**Why:** Enhances the educational value. Competitors ensure every interactive element is a learning opportunity.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a simple CSS tooltip or a small `?` icon next to each slider header that reveals a short definition on hover.

## Quick Wins (< 1 day each)
1.  **Data Export for Teachers (CSV):** Implementable purely on the frontend using existing state data.
2.  **Teacher View of Student Logs:** Can reuse the existing history list component and just pass a different `student_id` prop.
3.  **Contextual Equipment Tooltips:** Simple UI addition to the existing sliders in `Lab3D.jsx`.
