# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory enabling students to safely conduct and log experiments with interactive modules and teacher oversight.
**Market:** STEM Virtual Simulation / Virtual Labs for Education
**Date:** 2026-04-02
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz, PhET Interactive Simulations

## Executive Summary
The virtual science lab market is heavily driven by structured learning, seamless LMS integration, and real-time guidance. While Alchemistry has a strong interactive 3D foundation and basic tracking, competitors excel by wrapping simulations in guided workflows, dedicated lab manuals, and gamified progress. The biggest opportunity for Alchemistry is shifting from an open sandbox to a structured, guided learning environment, enabling students to better understand the *why* behind their actions without requiring constant teacher intervention.

## Competitor Analysis
- **Labster:** Market leader focusing on immersive, story-driven 3D simulations. Differentiates with automated grading, strict guided pathways, and a comprehensive instructor dashboard.
- **PraxiLabs:** Focuses on realistic simulations with a strong emphasis on accessibility, step-by-step guidance (Oxi assistant), and practice-centric repetition without penalties.
- **Beyond Labz:** Excels at data collection and academic integrity. Features a persistent "Lab Book" for raw data gathering and deep LMS (Canvas/Blackboard) integration via LTI.
- **PhET:** Highly accessible, 2D conceptual models. Focuses on intuitive, distraction-free visual feedback for foundational learning.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Step-by-step guided instructions overlay (currently only an AI hint system exists).
- Dedicated "Lab Manual" or notebook for students to record observations.

### Differentiating Opportunities (Stand-out features)
- Gamified learning (e.g., achievement badges for successful experiments).
- Variable simulation speed (fast-forwarding long reactions).

### UX Patterns (Design/interaction patterns common in top products)
- Persistent progress bars during a specific experiment module.
- Contextual, real-time feedback popups during mistakes (fail-fast mechanics).

## Prioritised Recommendations

### 1. Interactive Step-by-Step Lab Manual Overlay — Priority: HIGH | Effort: MEDIUM
**What:** An overlay component that guides students through an experiment step-by-step, checking off tasks as they go.
**Why:** Competitors (Labster, PraxiLabs) rely heavily on guided pathways to prevent students from getting stuck or aimlessly mixing chemicals.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `components/LabManual.jsx`.
**How:** Create a stateful `LabManual` component overlay in `Lab3D`. Define an array of steps (e.g., "Set HCl to 50%", "Add Indicator"). Track `chemA`, `chemB` changes to auto-check steps.

### 2. Student Lab Notebook — Priority: HIGH | Effort: MEDIUM
**What:** A digital notebook where students can type observations and save raw data alongside their experiment results.
**Why:** Beyond Labz features a "Lab Book" which is highly praised by educators for promoting scientific method thinking over just "playing a game".
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/history.jsx`.
**How:** Add a text area in `ResultModal.jsx` for "Observations". Update the `saveResult` Supabase call to include this text. Display the notes in `history.jsx` when expanding a log entry.

### 3. Gamification Badges — Priority: MEDIUM | Effort: SMALL
**What:** Visual badges awarded for completing specific milestones (e.g., "First Reaction", "Titration Master").
**Why:** Increases student engagement and retention. Top platforms use game-like progression to motivate students.
**Where in code:** `client/src/pages/Profile.jsx` and `client/src/store/historyStore.js`.
**How:** Derive badges dynamically in `Profile.jsx` based on the `logs` array from `historyStore` (e.g., `logs.length > 0` = "Beginner Badge"). Render them in a new section on the Profile page.

### 4. Real-time Mistake Feedback — Priority: MEDIUM | Effort: SMALL
**What:** Instant visual/text feedback when a student mixes an invalid combination, rather than just showing a generic error or nothing.
**Why:** PraxiLabs heavily promotes "Fail Fast, Learn Faster". Students need to know *why* a reaction didn't work immediately.
**Where in code:** `client/src/pages/Lab3D.jsx` (handlePlayClick error state).
**How:** Modify `handlePlayClick` catch block or the `reactionResult` handler to display specific toast messages based on the chemical combination, rather than generic network errors.

### 5. Experiment Progress Indicator — Priority: MEDIUM | Effort: SMALL
**What:** A visual progress bar showing how close a student is to completing an assigned experiment.
**Why:** Table-stakes UX pattern for multi-step labs to keep students oriented.
**Where in code:** `client/src/pages/titration.jsx`.
**How:** Add a simple progress bar component at the top of the titration screen that fills based on the `count` state relative to the target titration endpoint.

### 6. Simulation Speed Control — Priority: LOW | Effort: MEDIUM
**What:** A toggle to speed up animations for repetitive tasks.
**Why:** Beyond Labz allows fast-forwarding time, reducing frustration during multi-step or slow reactions.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (or wherever GSAP/Framer animations are defined).
**How:** Pass a `timeScale` prop to the 3D animation components to multiply the speed of the pouring/mixing animations.

### 7. Pre-Lab Quizzes — Priority: LOW | Effort: LARGE
**What:** A short, mandatory 3-question quiz before unlocking a lab module.
**Why:** Ensures students understand theory before practice, a standard feature in Labster.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and route guards.
**How:** Intercept clicks on `MODULE_CARDS`. Show a modal with questions fetched from Supabase. Only navigate to the lab route if passed.

### 8. Enhanced Accessibility (Keyboard Navigation) — Priority: MEDIUM | Effort: SMALL
**What:** Ensure all critical lab controls are fully operable via keyboard.
**Why:** PhET sets the standard for accessibility. Schools require ADA/WCAG compliance.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/titration.jsx`.
**How:** Add `tabIndex` and `onKeyDown` handlers to the chemical sliders and action buttons to ensure they can be adjusted using arrow keys.

### 9. Contextual "What's this?" Tooltips — Priority: LOW | Effort: SMALL
**What:** Information tooltips on chemical formulas and lab equipment.
**Why:** Helps bridge the gap between abstract UI and physical lab knowledge.
**Where in code:** `client/src/pages/Lab3D.jsx` (slider cards).
**How:** Add a `title` attribute or a small `?` icon with a CSS tooltip next to "HCl", "NaOH", etc., explaining their properties briefly.

### 10. Teacher "Live View" Dashboard — Priority: LOW | Effort: LARGE
**What:** Allow teachers to see which students are currently in the lab and their real-time state.
**Why:** Simulates the experience of a teacher walking around a physical lab room.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Utilize Supabase Realtime subscriptions on the `experiment_logs` or a new `active_sessions` table to update a list of online students.

## Quick Wins (< 1 day each)
1. **Gamification Badges:** Can be derived entirely front-end from existing history logs.
2. **Real-time Mistake Feedback:** Simple update to toast notifications in `Lab3D`.
3. **Contextual Tooltips:** Purely UI addition to the chemical sliders.
