# Market Research Report
**App:** Alchemistry is a web-based virtual 3D chemistry laboratory allowing students to safely run organic, inorganic, and titration experiments with real-time feedback and an AI tutor.
**Market:** EdTech / Virtual Science Lab Simulations
**Date:** 2026-03-24
**Competitors Researched:** Labster, PraxiLabs, Futuclass, VirtualChem Labs

## Executive Summary
The virtual chemistry lab market focuses on bridging the gap between theoretical knowledge and practical application, particularly for high schools and undergraduate programs facing resource or safety constraints. Top players (Labster, PraxiLabs) distinguish themselves through structured, gamified learning paths, rigorous safety protocols (even in virtual environments), and comprehensive educator tools. While Alchemistry has strong 3D visualization and an innovative AI tutor, it currently lacks the structured onboarding, formal safety checks, and exportable assignment outputs expected by educators in this space. Implementing these missing "table stakes" will significantly improve its viability for classroom adoption.

## Competitor Analysis
*   **Labster:** The market leader. Known for highly structured, gamified, and narrative-driven lab simulations. *Key Differentiator:* Deep integration with LMS systems and strong emphasis on virtual safety (PPE checks).
*   **PraxiLabs:** Focuses on realistic simulations across multiple sciences with a strong emphasis on real-time feedback and detailed lab manuals/reports. *Key Differentiator:* Interactive bilingual interface and detailed step-by-step guidance.
*   **Futuclass:** Targets younger students (middle/high school) with a strong gamification approach (puzzle-like modules). *Key Differentiator:* Short, 5-10 minute modules designed specifically for classroom engagement rather than open-ended research.
*   **VirtualChem Labs:** More advanced computational chemistry simulations. *Key Differentiator:* Focuses on industry-standard tools and accurate molecular simulations rather than pure gamification.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Exportable Lab Reports:** Students need a way to submit their work (PDF/CSV) to teachers.
*   **Pre-lab Safety Checks:** Enforcing virtual Personal Protective Equipment (PPE) before starting an experiment.
*   **Guided Onboarding:** A step-by-step tutorial for first-time users.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Achievement Badges:** Rewarding successful complex reactions or perfect titration scores.
*   **Predictive Hypothesis Input:** Asking the student what they *think* will happen before running the reaction.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Spotlight Tooltips:** Highlighting the next logical step in a sequence if the user idles.
*   **Persistent Lab Manual/Journal:** A slide-out panel that keeps track of notes during the experiment, rather than just an AI chat.

## Prioritised Recommendations

### 1. Exportable Lab Reports — Priority: HIGH | Effort: SMALL
**What:** Add a "Download Report" button to the History and Result pages that generates a PDF or CSV of the experiment outcome.
**Why:** Teachers need documented proof of student work for grading. This is a critical barrier to adoption.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/result.jsx`
**How:** Use `react-csv` or `jspdf` to format the existing `logs` or `data` state into a downloadable file.

### 2. Pre-Lab Safety / PPE Checklist — Priority: HIGH | Effort: SMALL
**What:** A modal that requires students to acknowledge safety protocols (e.g., clicking to "put on" virtual goggles, gloves, and a lab coat) before accessing the lab controls.
**Why:** Reinforces real-world safety habits, a key selling point for educators using virtual labs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/titration.jsx`
**How:** Create a `SafetyModal` component that blocks interaction until 3 checkboxes (Goggles, Gloves, Coat) are checked, storing the state locally for the session.

### 3. Guided First-Time Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step spotlight tutorial highlighting key UI elements (sliders, AI tutor, initiate button) for new users.
**Why:** The open-ended 3D lab can be overwhelming. Guided steps reduce friction and abandon rates.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Implement `react-joyride` or a custom tooltip overlay. Trigger it if `localStorage.getItem('hasSeenLabIntro')` is false.

### 4. Hypothesis Formulation Input — Priority: MEDIUM | Effort: SMALL
**What:** Before clicking "Initiate Reaction", prompt the student to guess the outcome (e.g., "Will it form a precipitate?", "What color will it turn?").
**Why:** Moves the user from passive observation to active scientific thinking, aligning with educational pedagogy.
**Where in code:** `client/src/pages/Lab3D.jsx` (before calling `initiateReaction`)
**How:** Add a simple prompt modal or dropdown selection in the `lab3d-actions` area when they click "Initiate", then compare the hypothesis to the actual `reactionResult` in the `ResultModal`.

### 5. Persistent Lab Journal — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out "Notes" panel where students can jot down observations during the experiment, which is saved alongside the result.
**Why:** Encourages documentation and mirrors real lab work better than just reading AI output.
**Where in code:** `client/src/pages/Lab3D.jsx`, `client/src/pages/titration.jsx`, and backend `experiment_results` table.
**How:** Add a `textarea` sidebar component that saves to a new `student_notes` column in the Supabase `experiment_results` table upon completion.

### 6. Achievement Badges (Gamification) — Priority: MEDIUM | Effort: MEDIUM
**What:** Award digital badges for milestones (e.g., "First Reaction", "Perfect Titration", "Mad Scientist" for mixing 4 chemicals).
**Why:** Increases engagement and motivation, especially for the high-school demographic.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and backend `profiles` or new `achievements` table.
**How:** Create a UI section in the dashboard to display earned badges, checking logic in `saveResult` functions.

### 7. Teacher Classroom Broadcast/Announcements — Priority: LOW | Effort: SMALL
**What:** A way for teachers to post a short message (e.g., "Today's goal: Find the concentration of NaOH") that appears on the student dashboard.
**Why:** Improves classroom management and gives context to the session.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/pages/StudentDashboard.jsx`.
**How:** Add an `announcement` column to the `classrooms` table. Allow teachers to edit it, and display it prominently on the student dashboard if they belong to that class.

### 8. Keyboard Accessibility for 3D Lab — Priority: HIGH | Effort: MEDIUM
**What:** Ensure all sliders and the "Initiate Reaction" button in the 3D lab are fully operable via keyboard (Tab and Arrow keys), and screen readers announce values.
**Why:** Accessibility compliance is often legally required for EdTech software sold to schools.
**Where in code:** `client/src/pages/Lab3D.jsx` (specifically the `.slider-card` inputs).
**How:** Add appropriate `aria-labels`, ensure inputs have `tabIndex`, and use `aria-live` regions for dynamic value changes.

### 9. Time-on-Task Tracking — Priority: LOW | Effort: SMALL
**What:** Record how long a student spends on a specific experiment module and display it in the teacher analytics.
**Why:** Teachers want to know if students rushed through the lab in 2 minutes or spent 20 minutes thoughtfully adjusting levels.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/titration.jsx` (start/end timers) and backend.
**How:** Use `Date.now()` on mount and unmount/completion, calculating duration, and save it to the `experiment_results` table.

### 10. Pause/Resume State — Priority: LOW | Effort: LARGE
**What:** Allow students to save their current setup (slider values, titration progress) and return to it later.
**Why:** Class periods end abruptly; losing progress is frustrating.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/titration.jsx`.
**How:** Sync the current state to `localStorage` or Supabase periodically, and check for saved state on component mount.

## Quick Wins (< 1 day each)
1. **Exportable Lab Reports:** Adding CSV export to the History page using the existing `logs` state is trivial and high-value.
2. **Pre-Lab Safety / PPE Checklist:** A simple blocking modal with checkboxes in the Lab3D component.
3. **Hypothesis Formulation Input:** A simple confirmation dialog before running the reaction.