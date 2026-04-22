# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory built with React and Three.js for interactive chemistry experiments.
**Market:** Virtual Science Education & Lab Simulation
**Date:** 2026-04-22
**Competitors Researched:** Labster, ChemVerse, PraxiLabs

## Executive Summary
The virtual chemistry lab space is highly competitive, focusing on safe, interactive environments that replicate real-world experiences. Top products like Labster and PraxiLabs differentiate through deep curricular integration, interactive guidance, gamification, and robust analytics for educators. Alchemistry currently offers an excellent foundation with its 3D environment, AI tutor, and Supabase backend. The largest opportunities lie in enhancing the user experience through interactive guided procedures (walkthroughs), robust educator analytics and reporting, and gamified assessments (quizzes), mapping closely to standard educational requirements.

## Competitor Analysis
* **Labster:** Market leader offering highly immersive, gamified simulations matched to syllabi. Key differentiators: curriculum alignment, high-fidelity 3D, gamified quizzes, strong LMS integration, and detailed educator dashboards.
* **ChemVerse:** Free, browser-based lab aimed at high school/BSc students. Key differentiators: step-by-step guided observations, focus on safety and exam prep, and accessibility without downloads.
* **PraxiLabs:** Focuses on realistic 3D science labs with strong institutional features. Key differentiators: game-like simulations with hints, in-lab manual/skip options, multiple-choice assessments, bilingual support, and comprehensive learning analytics/LMS integration.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Pre- and Post-Lab Quizzes:** Competitors use integrated quizzes to assess understanding before or after the experiment. Alchemistry has no quiz mechanism.
* **Step-by-Step Guided Walkthroughs:** Competitors provide in-app guidance, hints, and structured steps. Alchemistry relies on the user to "Mix at least 2 chemicals to start" with limited structural guidance.
* **Lab Manuals/Worksheets:** Competitors provide built-in reference materials. Alchemistry currently mentions "Refer Your Chemistry Lab Manual Page" as plain text notes rather than providing an accessible on-screen manual.

### Differentiating Opportunities (Stand-out features)
* **Data Export functionality:** Competitors allow exporting results for lab reports.
* **LMS/Classroom Integration:** Deep integration for grading. (Alchemistry has some teacher/classroom foundations but lacks grading exports).
* **Game-like elements:** Badges, progression tracking, or explicit hints.

### UX Patterns (Design/interaction patterns common in top products)
* **Progress Tracking Bar:** Visual indicator of experiment completion percentage.
* **Tooltips / Contextual Help:** On-demand help without full AI interaction.

## Prioritised Recommendations

### 1. In-Lab Progress Tracker & Guided Steps — Priority: HIGH | Effort: MEDIUM
**What:** Add a visual progression system that guides the student through specific required steps of an experiment (e.g., Step 1: Select Reactants, Step 2: Set Temperature, Step 3: Initiate).
**Why:** ChemVerse and PraxiLabs emphasize guided step-by-step learning. Currently, Alchemistry has a free-form mixing approach which can leave students lost.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add an `experimentSteps` array to `labStore`. Create a `ProgressTracker` component in `Lab3D.jsx` mapping through these steps, highlighting the current step and validating completion before allowing "Initiate Reaction".

### 2. Pre/Post-Lab Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Introduce a brief multiple-choice quiz component that appears after an experiment finishes or before it starts to validate learning.
**Why:** Labster and PraxiLabs rely heavily on quizzes for assessment. This bridges the gap between simulation and academic grading.
**Where in code:** `client/src/components/ResultModal.jsx` and new `QuizModal.jsx`
**How:** Add a "Take Quiz" button to `ResultModal.jsx` which opens a new `QuizModal` component. Store quiz results in Supabase via a new or updated table, visible to teachers.

### 3. Integrated Digital Lab Manual — Priority: MEDIUM | Effort: SMALL
**What:** A slide-out or modal component containing the experiment's instructions, safety warnings, and expected outcomes.
**Why:** Currently, `organic.jsx` says "Refer Your Chemistry Lab Manual". Competitors like PraxiLabs integrate this directly into the UI so students don't need external physical books.
**Where in code:** `client/src/components/LabManualPanel.jsx` (New) and `client/src/pages/Lab3D.jsx`
**How:** Create a toggleable sliding panel similar to `AiTutorPanel.jsx` that loads manual content based on the current experiment type, improving accessibility.

### 4. Exportable Lab Reports (CSV/PDF) — Priority: MEDIUM | Effort: SMALL
**What:** Allow students and teachers to export experiment history and results.
**Why:** Essential for homework submission. Competitors seamlessly connect virtual labs to tangible assignments.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export to CSV" button that takes the `historyLogs` array from `useHistoryStore` and converts it to a CSV string for download using standard Blob browser APIs.

### 5. Educator Analytics & Insights View — Priority: MEDIUM | Effort: MEDIUM
**What:** Enhance the Teacher Dashboard with charts showing common mistakes, average completion times, and quiz scores.
**Why:** PraxiLabs and Labster market heavily to institutions based on their analytics and reporting capabilities.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Expand `TeacherDashboard.jsx` (when `analytics` prop is true) to aggregate history data from the classroom and display success/failure rates of specific experiments.

### 6. Interactive Tooltips for Apparatus — Priority: LOW | Effort: SMALL
**What:** Hover tooltips over 3D models (Beakers, Flasks, Burners) explaining their name and function.
**Why:** Enhances the onboarding experience. New students often don't know the names of lab equipment.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` or related 3D component files.
**How:** Use `@react-three/drei`'s `Html` component to render small tooltip labels over interactive 3D meshes on hover.

### 7. Gamified Badges for Milestones — Priority: LOW | Effort: MEDIUM
**What:** Award badges for completing categories (e.g., "Organic Master" for 5 successful organic reactions).
**Why:** Increases engagement and replayability, a core strength of Labster.
**Where in code:** `client/src/pages/Profile.jsx` and Supabase schema.
**How:** Add a `badges` array to the user profile. Check history counts on load and display badge icons in the Profile page.

## Quick Wins (< 1 day each)
1. **Integrated Digital Lab Manual:** Easily built by reusing the `AiTutorPanel` UI structure for static text.
2. **Exportable Lab Reports:** A simple JavaScript function in the history page.
3. **Interactive Tooltips for Apparatus:** Quick integration using `Html` from `@react-three/drei`.
