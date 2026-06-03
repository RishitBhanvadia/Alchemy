# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory for students to conduct interactive experiments with real-time feedback, complete with a teacher dashboard for tracking student progress.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-06-03
**Competitors Researched:** Labster, PhET Interactive Simulations, ExploreLearning Gizmos, PraxiLabs

## Executive Summary
The virtual science laboratory market is moving from passive simulations toward highly guided, scenario-based learning environments integrated deeply with assessment workflows. Top platforms differentiate themselves through structured onboarding, step-by-step experiment guidance, and robust reporting tools. Alchemistry has a strong technical foundation with its 3D environment and teacher dashboard, but it currently lacks the scaffolding needed for beginners and the export capabilities expected by educators for formal assessment. The top opportunities lie in adding guided workflows, exportable lab reports, and more granular progress tracking.

## Competitor Analysis
- **Labster:** The market leader. Offers highly guided, scenario-based 3D lab simulations. Excels at step-by-step guidance, immersive storytelling, and integrated quizzes.
- **PhET Interactive Simulations:** Free, widely used 2D simulations. Focuses on open-ended exploration and conceptual understanding with minimal scaffolding.
- **ExploreLearning Gizmos:** Offers interactive math and science labs with strong teacher dashboards, standards-aligned lesson plans, and structured student activities.
- **PraxiLabs:** Focuses on realistic 3D lab simulations with deep procedural accuracy and comprehensive lab manuals.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Guided Onboarding/Tutorials:** Step-by-step walkthroughs of lab equipment and interface controls.
- **Exportable Lab Reports:** Ability for students to download their results as a PDF or CSV for submission.

### Differentiating Opportunities (Stand-out features)
- **Scenario-Based Missions:** Framing experiments within a real-world problem or narrative (e.g., "Test the local water supply").
- **LMS Integration (LTI):** Syncing grades and rosters directly with Canvas/Blackboard.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Tooltips:** Hints that appear only when a student is stuck or interacting with a specific tool for the first time.
- **In-Lab Notebook:** A persistent panel where students can record observations and data during the experiment.

## Prioritised Recommendations

### 1. Guided Lab Tutorial (First-time User Experience) — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step interactive tutorial that walks new users through basic controls (moving, selecting equipment, pouring) in the 3D environment.
**Why:** Competitors like Labster provide extensive scaffolding. Without it, the 3D environment can cause cognitive overload for beginners.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/CanvasContainer.jsx`
**How:** Add a `hasSeenTutorial` flag to `localStorage`. If false, overlay a guided tour component (e.g., using `react-joyride` or custom modals) that highlights specific UI elements or 3D objects sequentially.

### 2. Exportable Lab Reports — Priority: HIGH | Effort: SMALL
**What:** Allow students to download their experiment history and results as a CSV or PDF.
**Why:** Teachers require formal artifacts for grading. All major virtual labs support data export.
**Where in code:** `client/src/pages/History.jsx` and `client/src/pages/result.jsx`
**How:** Add an "Export to CSV" button. Map the experiment data from the Supabase query into a CSV format using a lightweight utility function and trigger a file download.

### 3. Contextual Hints / In-Lab Assistant — Priority: MEDIUM | Effort: MEDIUM
**What:** Contextual hints that appear when a student is struggling or hovering over complex equipment.
**Why:** Reduces frustration and keeps students engaged. Top products use intelligent tutoring features.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a 'Hint' state that triggers a tooltip or dialogue box based on the current step of the experiment or time spent inactive.

### 4. Interactive Lab Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out panel in the 3D lab where students can type notes, record measurements, and answer pre-lab questions.
**Why:** Encourages active learning and procedural documentation, mirroring real-world lab practices.
**Where in code:** `client/src/pages/Lab3D.jsx` (New component: `LabNotebookPanel.jsx`)
**How:** Create a collapsible sidebar component mapped to a state variable. Save the notebook contents to the database (`experiment_logs` or a new table) upon experiment completion.

### 5. Teacher Data Export — Priority: MEDIUM | Effort: SMALL
**What:** Allow teachers to export the student progress grid from their dashboard.
**Why:** Teachers often need to manipulate grades in external spreadsheet software or upload them to an LMS.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an "Export Data" button above the TanStack table. Iterate through the table's row model and generate a CSV of student names, XP, and experiment counts.

### 6. Granular Skill Badging — Priority: LOW | Effort: SMALL
**What:** Expand the current generic badge system (1 badge per 5 experiments) to specific skills (e.g., "Master Titrator", "Safety First").
**Why:** Gamification increases engagement, but specific skill badges provide better feedback on competencies.
**Where in code:** `server/controllers/resultController.js` and `client/src/pages/Profile.jsx`
**How:** Update the backend logic to award specific badges based on `experiment_type` or perfect scores, and display these distinct badges in the student profile.

### 7. Pre-Lab Quizzes — Priority: LOW | Effort: MEDIUM
**What:** A short, required quiz before starting an experiment to ensure theoretical understanding and safety knowledge.
**Why:** Standard practice in physical and virtual labs to assess readiness.
**Where in code:** New component/route before entering `client/src/pages/Lab3D.jsx`
**How:** Create a modal or interstitial page that presents 3-5 multiple-choice questions fetched from a predefined list before granting access to the 3D scene.

### 8. Real-time Classroom Activity Feed — Priority: LOW | Effort: MEDIUM
**What:** A ticker or feed on the Teacher Dashboard showing real-time events (e.g., "Student A started Titration", "Student B earned a perfect score").
**Why:** Provides immediate visibility into classroom engagement during synchronous lab sessions.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Utilize Supabase Realtime subscriptions on the `experiment_logs` table to stream and display new entries in a sidebar component.

### 9. Scenario / Mission Briefings — Priority: LOW | Effort: SMALL
**What:** Replace generic experiment names with engaging scenarios (e.g., "Determine the concentration of acetic acid in commercial vinegar").
**Why:** Increases relevance and student motivation by connecting chemistry to real-world applications.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and experiment selection UI.
**How:** Update the UI text and experiment metadata to include a "Scenario" or "Mission Brief" description alongside the standard chemical task.

### 10. Accessibility Mode (High Contrast/Text Scaling) — Priority: LOW | Effort: SMALL
**What:** Toggles for high contrast and larger text within the lab environment.
**Why:** Ensures compliance and usability for a wider range of students.
**Where in code:** `client/src/components/Navbar.jsx` and global CSS.
**How:** Add a settings toggle that applies a CSS class to the `body`, modifying CSS variables for colors and font sizes.

## Quick Wins (< 1 day each)
1. **Exportable Lab Reports:** Easy to implement using vanilla JavaScript or a small library to generate CSVs from existing React state.
2. **Teacher Data Export:** Leverages the existing TanStack table data in the Teacher Dashboard for a quick CSV export.
3. **Scenario / Mission Briefings:** Purely a content/UI update that significantly improves the perceived value and engagement of the experiments.
