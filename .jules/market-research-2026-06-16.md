# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** EdTech / Virtual Science Lab Simulations
**Date:** 2026-06-16
**Competitors Researched:** Labster, Beyond Labz, ChemCollective

## Executive Summary
The virtual chemistry lab market is highly focused on combining realistic simulations with structured learning paths. Current top products don't just provide an open sandbox; they guide students through learning objectives, quiz them interactively, and integrate heavily with Learning Management Systems (LMS) and accessibility standards. Alchemistry has a strong technical foundation (3D rendering, AI tutor) but lacks some of the critical instructional design elements that make competitors indispensable in classrooms, such as structured pre-lab/post-lab assessments and broader accessibility features.

## Competitor Analysis

*   **Labster:** The market leader in high-fidelity, gamified virtual labs. Differentiates heavily through "Immersive STEM Learning Experiences," embedded quizzes with automated grading, and deep LMS integrations.
*   **Beyond Labz:** Focuses on realistic, open-ended environments where students can safely make mistakes and collect raw data. Key differentiators include comprehensive lab books for recording data and authentic instruments (like Mass Spectrometry and IR).
*   **ChemCollective:** A robust, accessible, free-to-use virtual lab focused strongly on computational chemistry and scenario-based learning. Very strong on standard chemical calculations rather than visual fidelity.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Embedded Quizzes & Automated Grading:** Competitors use quizzes to gate progress and automatically grade students.
*   **Comprehensive Lab Notebook/Journal:** A dedicated space for students to record observations, raw data, and graphs during experiments.
*   **LMS Integration (LTI):** Seamless connection to Canvas, Blackboard, etc., for assignment delivery and grade sync.

### Differentiating Opportunities (Stand-out features)
*   **"Safe Mistakes" Mechanics:** Beyond Labz emphasizes allowing students to fail safely (e.g., mixing the wrong chemicals causes a controlled virtual explosion or error state) to teach consequences without real-world danger.
*   **Accessibility (Screen Readers & Keyboard Nav for 3D):** While the app has `accessibility.css`, full screen-reader support and keyboard navigation for the 3D canvas is often a premium feature in tools like Labster.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips/Onboarding Tour:** First-time user experiences that guide students through the lab equipment and interface.
*   **Split-Screen View:** Having the 3D lab on one side and the lab notebook/instructions on the other.

## Prioritised Recommendations

### 1. Lab Notebook / Data Collection Panel — Priority: HIGH | Effort: MEDIUM
**What:** A persistent side panel or modal where students can record observations and data points during an experiment.
**Why:** Standard across all major competitors (Beyond Labz, Labster). Essential for turning a "game" into a pedagogical tool.
**Where in code:** Add a `LabNotebook.jsx` component to `client/src/components/student/` and integrate it into `client/src/pages/Lab3D.jsx`.
**How:** Create a slide-out drawer using Framer Motion that saves text and data points to local state or Supabase.

### 2. Formative Assessments (In-Experiment Quizzes) — Priority: HIGH | Effort: MEDIUM
**What:** Short multiple-choice questions that pop up at critical stages of the experiment to verify understanding before proceeding.
**Why:** Labster's core loop relies on this for automated grading and ensuring students aren't just clicking aimlessly.
**Where in code:** `client/src/components/student/` (Create `QuizModal.jsx`) and trigger from experiment logic in `Lab3D.jsx` or specific experiment pages (e.g., `titration.jsx`).
**How:** Define a JSON schema for questions mapped to experiment steps. Render a modal that prevents interaction with the lab until answered correctly.

### 3. Interactive Onboarding Tour — Priority: MEDIUM | Effort: SMALL
**What:** A step-by-step guided tour of the UI and lab equipment for first-time users.
**Why:** Reduces cognitive load for new students and is a standard UX pattern in complex web apps.
**Where in code:** `client/src/pages/Lab3D.jsx` or as a wrapper component.
**How:** Use a library like `react-joyride` or build a custom overlay highlighting the Beaker, Flask, AiTutorPanel, etc., using a `hasSeenTour` flag in `localStorage`.

### 4. "Safe Mistakes" Visual Feedback — Priority: MEDIUM | Effort: LARGE
**What:** Visual and auditory feedback when a student makes a procedural error (e.g., adding water to acid).
**Why:** Differentiates the product by teaching safety and consequences, a highly praised feature of Beyond Labz.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/`
**How:** Add error states to the Three.js models (e.g., a shattered flask texture, particle system for smoke) triggered by incorrect state combinations in the experiment logic.

### 5. Multi-format Export (CSV/PDF) for Results — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to export their experiment history and lab notebook entries to PDF or CSV.
**Why:** Necessary for submitting assignments if full LMS integration isn't present yet.
**Where in code:** `client/src/pages/history.jsx` and `client/src/components/ResultModal.jsx`
**How:** Implement client-side PDF generation (e.g., `jspdf`) or simple CSV string building from the experiment result data.

### 6. Realistic Instrument Simulation (e.g., pH Meter, Spectrophotometer) — Priority: LOW | Effort: LARGE
**What:** Adding more complex, interactive instruments beyond basic glassware.
**Why:** Expands the curriculum capabilities to match higher-ed requirements seen in Labster and Beyond Labz.
**Where in code:** `client/src/components/3d-animations/` and specific lab pages.
**How:** Build new Three.js models and corresponding React state logic for instrument calibration and reading.

### 7. Teacher Analytics Dashboard Enhancement — Priority: MEDIUM | Effort: MEDIUM
**What:** Aggregate view of common student mistakes and completion times.
**Why:** Teachers need actionable data, not just completion checkboxes. Labster highlights this as a key value proposition.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Add new Supabase queries to fetch aggregate error rates and visualize them using Recharts or Chart.js.

### 8. Keyboard Navigation for 3D Elements — Priority: LOW | Effort: LARGE
**What:** Allow students to navigate the 3D lab space and interact with objects using only the keyboard.
**Why:** Critical for WCAG compliance and accessibility, a major purchasing factor for schools.
**Where in code:** `client/src/pages/Lab3D.jsx` and Three.js event handlers.
**How:** Map keyboard events (Tab, Enter, Arrows) to raycasting or specific object selection states in the 3D scene.

### 9. Contextual AI Tutor Prompts — Priority: HIGH | Effort: SMALL
**What:** The AI Tutor proactively offers hints if a student is idle for too long or makes repeated errors.
**Why:** Maximizes the existing AI feature (which competitors often lack) to provide a "guide on the side."
**Where in code:** `client/src/components/AiTutorPanel.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Add an idle timer or error counter in the lab state that triggers a predefined prompt sent to the AI backend.

### 10. LMS LTI Integration — Priority: LOW | Effort: LARGE
**What:** Support for LTI 1.3 to allow single sign-on and grade passback with Canvas, Moodle, etc.
**Why:** The biggest barrier to enterprise adoption in EdTech.
**Where in code:** `server/routes/` and a new LTI controller.
**How:** Implement the LTI Advantage specification on the Node/Express backend.

## Quick Wins (< 1 day each)
1.  **Multi-format Export (CSV):** Easily map existing result data to a downloadable CSV file in `history.jsx`.
2.  **Interactive Onboarding Tour:** Quickly implement a basic UI highlight tour for new users.
3.  **Contextual AI Tutor Prompts:** Add simple idle detection to trigger the existing `AiTutorPanel.jsx`.
