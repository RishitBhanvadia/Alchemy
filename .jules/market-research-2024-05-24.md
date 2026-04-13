# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive chemistry experiments in a 3D environment while teachers manage classrooms and track progress.
**Market:** EdTech STEM Education (Virtual Laboratories)
**Date:** 2024-05-24
**Competitors Researched:** Labster, Beyond Labz, PraxiLabs

## Executive Summary
The virtual chemistry lab market has transitioned from basic 2D simulations to immersive 3D experiences integrated with LMS capabilities. Alchemistry already possesses a strong foundation with its 3D environment and teacher dashboard. However, top competitors excel by providing guided, narrative-driven learning experiences rather than pure sandbox environments. The most significant opportunity for Alchemistry is to bridge its physics-based simulation with structured, curriculum-aligned lab guides and post-experiment assessments directly within the UI.

## Competitor Analysis
* **Labster:** Market leader. Known for gamified, story-driven 3D simulations. Focuses heavily on student engagement and assessment.
* **Beyond Labz:** Focuses on high-fidelity, open-ended "photorealistic" sandbox labs. Strong in higher education.
* **PraxiLabs:** Offers interactive 3D labs with a focus on accessibility, multi-language support, and split-screen theoretical background information.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* Interactive, step-by-step lab manuals/guides alongside the simulation.
* Post-experiment quizzes to assess conceptual understanding.

### Differentiating Opportunities (Stand-out features)
* Comprehensive accessibility (keyboard navigation for 3D interactions).
* Easy data export (CSV) for teachers to sync with Student Information Systems.

### UX Patterns (Design/interaction patterns common in top products)
* Split-screen UI (theory/instructions on one side, interactive lab on the other).
* In-canvas contextual floating tooltips for equipment and chemicals.

## Prioritised Recommendations

### 1. Interactive Step-by-Step Lab Guide — Priority: HIGH | Effort: MEDIUM
**What:** A side panel showing the current step of an assignment (e.g., "Add 50% HCl").
**Why:** Competitors guide students step-by-step rather than just providing a sandbox, which improves learning outcomes.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `useAssignmentGuide` hook and a `LabGuidePanel` component that tracks chemical levels (`chemA`, `chemB`) and auto-checks steps based on the current assignment.

### 2. Gamified Post-Experiment Quizzes — Priority: HIGH | Effort: SMALL
**What:** A short, multiple-choice quiz that appears after a successful reaction.
**Why:** Ensures students understand the chemistry concepts, not just the mechanics of moving sliders.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Add a `quizData` prop based on `reactionResult.experiment_type` and add a question step before revealing the final score.

### 3. Split-Screen Theory vs. Lab View — Priority: MEDIUM | Effort: MEDIUM
**What:** A toggleable panel containing theoretical background or documentation next to the 3D lab.
**Why:** Users currently rely on the AI tutor or guessing. A static reference is standard in PraxiLabs and Labster.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a resizable sidebar or toggleable panel containing Markdown/HTML content related to the active experiment.

### 4. Detailed CSV Export for Teacher Analytics — Priority: MEDIUM | Effort: SMALL
**What:** A feature to export the student progress table to a CSV file.
**Why:** Teachers need to import grades into official Student Information Systems (SIS).
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an "Export to CSV" button that iterates over the `students` array and triggers a download using Blob URLs or `papaparse`.

### 5. In-Canvas Contextual Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Floating labels over 3D objects (eakers, flasks) on hover.
**Why:** Improves discoverability of interactive elements within the 3D scene.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Use `@react-three/drei`'s `Html` component to render tooltips based on `onPointerOver` and `onPointerOut` events on meshes.

### 6. Accessibility: Keyboard Controls for Sliders — Priority: HIGH | Effort: SMALL
**What:** Ensure all chemical sliders can be easily adjusted using the keyboard.
**Why:** Educational tools must meet WCAG accessibility standards.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Verify the `<input type="range">` elements have proper `aria-labels` and ensure keyboard event listeners allow adjusting values without a mouse.

### 7. Teacher: Individual Student Detail View — Priority: MEDIUM | Effort: SMALL
**What:** Clicking a student in the data grid opens a modal showing their specific experiment history.
**Why:** Teachers need granular data to help struggling students, rather than just aggregate metrics.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Make the rows in the TanStack table clickable, opening a `StudentDetailModal` that fetches from `experiment_logs` for that specific `student_id`.

### 8. "Save State" Functionality — Priority: LOW | Effort: MEDIUM
**What:** The ability to pause an experiment and return later with the exact same chemical levels.
**Why:** Class periods might end before a complex experiment is finished.
**Where in code:** `client/src/store/labStore.js`
**How:** Sync the `labStore` state to `localStorage` or Supabase on change, and load it on initialization.

### 9. Pre-lab Safety Briefing Check — Priority: LOW | Effort: SMALL
**What:** A mandatory "I have read the safety guidelines" acknowledgment before entering the lab.
**Why:** Simulates real-world lab requirements and is standard in educational simulations.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Display a modal on mount if a `hasSeenSafety` flag is not present in `localStorage`.

### 10. Multi-language Support (i18n) Foundation — Priority: LOW | Effort: LARGE
**What:** Infrastructure to support languages other than English.
**Why:** Expands market reach (competitors advertise bilingual support).
**Where in code:** Across all UI components in `client/src/`.
**How:** Integrate `react-i18next` and begin extracting hardcoded strings in `StudentDashboard.jsx` and `Lab3D.jsx`.

## Quick Wins (< 1 day each)
1. Gamified Post-Experiment Quizzes (modify `ResultModal.jsx`)
2. Detailed CSV Export for Teacher Analytics (modify `TeacherDashboard.jsx`)
3. Pre-lab Safety Briefing Check (modify `Lab3D.jsx`)
