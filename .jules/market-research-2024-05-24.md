# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments.
**Market:** Educational Virtual Laboratories / EdTech Chemistry Simulations
**Date:** 2024-05-24
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz, PhET Interactive Simulations

## Executive Summary
The virtual chemistry laboratory market is highly focused on integrating theoretical learning seamlessly with hands-on 3D simulation. Top competitors excel by providing structured guidance, comprehensive safety gating, and deeply integrated theory via lab manuals. While Alchemistry has a strong 3D physics foundation and an innovative AI tutor, it currently lacks the structured onboarding and theoretical reference points that educators expect. Implementing pre-lab quizzes, an in-simulation lab manual, and contextualizing the AI tutor are the most impactful steps to elevate Alchemistry to market standards.

## Competitor Analysis
*   **Labster:** The market leader. Known for deeply immersive 3D environments with strong gamification, step-by-step contextual guidance, and integrated quiz assessments during experiments.
*   **PraxiLabs:** Focuses heavily on providing structured lab manuals, clear learning objectives before starting experiments, and real-time feedback.
*   **Beyond Labz:** Offers highly realistic sandbox environments but supplements them with detailed virtual lab books and worksheets that students must fill out.
*   **PhET Interactive Simulations:** Simpler 2D simulations, but excels in making concepts highly visual with immediate feedback and no barrier to entry.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Pre-Lab Safety/Theory Gates:** Competitors require students to prove theoretical understanding before entering the lab.
*   **Integrated Lab Manual:** Top products have an on-screen reference for theory and procedures.
*   **Structured Experiment Reset/Steps:** Instead of just a "Reset" button, clear step-by-step tracking.

### Differentiating Opportunities (Stand-out features)
*   **Context-Aware AI Tutor:** Leveraging the existing AI but making it aware of the specific assignment/step.
*   **Gamified Progression:** Visual badges or XP for successful experiments to increase engagement.

### UX Patterns (Design/interaction patterns common in top products)
*   **Collapsible Side Panels:** For theory, hints, and manual without obstructing the 3D view.
*   **Contextual Tooltips:** Highlighting what to click next if a student idles for too long.

## Prioritised Recommendations

### 1. Pre-Lab Quiz Gate — Priority: HIGH | Effort: MEDIUM
**What:** Require students to pass a short quiz before unlocking the 3D Lab.
**Why:** Standard in EdTech to ensure theoretical understanding before practical application.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `PreLabQuiz.jsx` component.
**How:** Add a state `hasPassedPreLab` to `labStore.js`. If false, render `PreLabQuiz` overlaying the canvas. On pass, set to true and reveal the 3D lab.

### 2. Integrated Lab Manual Panel — Priority: HIGH | Effort: SMALL
**What:** A collapsible side panel displaying theoretical background and formulas.
**Why:** Students currently have to rely on external notes or AI. Competitors embed manuals directly.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `LabManualPanel.jsx`.
**How:** Create a toggle button similar to the `history-toggle`. Use a simple slide-in panel (like `lab-history-panel`) fetching static markdown or assigned theory data.

### 3. Context-Aware AI Prompting — Priority: HIGH | Effort: SMALL
**What:** Enhance the `/api/ai/hint` request to include current assignment data.
**Why:** Labster provides hints based on what the student *should* be doing.
**Where in code:** `client/src/store/labStore.js` (in `initiateReaction` or hint fetcher) and `server/routes/aiRoutes.js`.
**How:** Pass `currentAssignments[0]` context in the payload when fetching hints so the AI knows the target goal.

### 4. Gamified Student Dashboard (XP/Badges) — Priority: MEDIUM | Effort: MEDIUM
**What:** Display XP or badges based on completed experiments.
**Why:** Increases engagement. PhET and Labster use gamification effectively.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/components/student/`.
**How:** Calculate XP based on `logs.length * score` in `HistoryStore` or a new `gamificationStore`. Display a progress bar in the welcome header of `StudentDashboard`.

### 5. Export Experiment Results to PDF/CSV — Priority: MEDIUM | Effort: SMALL
**What:** Allow students to download their lab results.
**Why:** Beyond Labz uses lab books that can be exported for grading.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/history.jsx`.
**How:** Add a "Download Report" button that uses a simple library (like `jspdf` or standard CSV formatting) to export the `reactionResult` data.

### 6. Interactive Step Tracker — Priority: MEDIUM | Effort: MEDIUM
**What:** A visual progress bar showing steps in an assignment (e.g., Step 1: Add Acid, Step 2: Add Base).
**Why:** Prevents students from feeling lost in the sandbox.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/assignmentStore.js`.
**How:** Parse assignment requirements into steps and display a checklist UI component above the slider controls.

### 7. Chemical Information Tooltips — Priority: LOW | Effort: SMALL
**What:** Hovering over a chemical slider shows its properties (molar mass, hazard level).
**Why:** Educational value during interaction.
**Where in code:** `client/src/pages/Lab3D.jsx` (slider-card section).
**How:** Add `title` attributes or a custom tooltip component to `.slider-header` elements using static data mapping.

### 8. Teacher Analytics Enhancement — Priority: LOW | Effort: MEDIUM
**What:** Show which chemicals students struggle with most.
**Why:** Teachers need actionable insights beyond just "PASS/PENDING".
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `server/controllers/teacherController.js`.
**How:** Aggregate `experiment_logs` on the backend to find the most common failed combinations and display them in a new chart.

### 9. Shareable Experiment Links — Priority: LOW | Effort: SMALL
**What:** Allow students to share a specific completed reaction result.
**Why:** Encourages peer learning.
**Where in code:** `client/src/components/ResultModal.jsx`.
**How:** Add a "Copy Link" button that generates a URL with the `reaction_id` (e.g., `/result?id=123`), requiring an update to the `Result` page to fetch by ID.

### 10. Dark/Light Theme Toggle — Priority: LOW | Effort: SMALL
**What:** Add a standardized theme toggle.
**Why:** Standard UX feature, especially useful in educational tools to reduce eye strain.
**Where in code:** `client/src/components/Navbar.jsx` and `client/src/app.css`.
**How:** Implement a simple state toggle that adds a `.light-theme` class to the body, overriding the default dark variables.

## Quick Wins (< 1 day each)
1.  **Integrated Lab Manual Panel:** Reusing the history panel's slide-in logic makes this very fast to implement.
2.  **Context-Aware AI Prompting:** Merely requires appending the active assignment to the existing AI fetch payload.
3.  **Chemical Information Tooltips:** Adding native tooltips or a simple wrapper to the existing sliders requires minimal UI changes.