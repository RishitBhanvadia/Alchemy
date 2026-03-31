# Market Research Report
**App:** Alchemistry is a web-based interactive 3D virtual chemistry laboratory enabling students to conduct chemistry experiments (organic, inorganic, and titration) safely with real-time feedback, analytics, and an AI tutor.
**Market:** Virtual Science Education / Virtual Laboratory Simulators (EdTech)
**Date:** 2026-03-31
**Competitors Researched:** PraxiLabs, iXR Labs, Labster

## Executive Summary
The virtual chemistry lab market is characterized by a strong demand for immersive, risk-free educational tools that offer high-fidelity simulations. Competitors like Labster, PraxiLabs, and iXR Labs emphasize broad scientific coverage, LMS integrations, and gamified or guided learning paths. Alchemistry has a solid foundation with its 3D interactive physics and AI tutor. However, to compete effectively, it needs to adopt established features like structured guided learning, deeper gamification (badges/achievements), and seamless export of experiment data, while leveraging its unique strengths like the AI tutor.

## Competitor Analysis
*   **Labster:** A major player offering highly immersive 3D simulations. It focuses on engaging storylines, gamified approaches, and broad coverage of sciences. It's known for strong academic credibility but can be premium-priced.
*   **PraxiLabs:** Focuses on accessibility (no hardware needed) and offers multimedia content, voice guidance, and interactive simulations. It has strong LMS integration and caters to various learning styles (visual, auditory, kinesthetic).
*   **iXR Labs:** Emphasizes virtual reality and 3D simulations for practical learning, focusing on bringing concepts to life without memorizing formulas.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Guided Learning / Tutorials:** Competitors offer guided learning pathways. Alchemistry currently relies on an AI tutor and basic UI hints but lacks a structured, step-by-step tutorial for first-time users.
*   **Experiment Data Export:** Top tools support exporting data (e.g., CSV). Alchemistry tracks history but lacks an easy export feature for students or teachers.
*   **Gamification & Achievements:** Labster uses gamification effectively. Alchemistry has a success celebration but lacks a persistent badge/achievement system.

### Differentiating Opportunities (Stand-out features)
*   **Voice-Guided AI Tutor:** PraxiLabs uses voice guidance. Alchemistry has an AI tutor; adding text-to-speech could be a strong differentiator.
*   **Contextual Tooltips:** Competitors provide contextual help. Alchemistry could enhance onboarding with contextual tooltips for specific lab equipment.

### UX Patterns (Design/interaction patterns common in top products)
*   **Persistent Progress Indicators:** Showing progress through a guided experiment.
*   **Accessible Data Visualization:** Clear, exportable graphs for results (e.g., titration curves).

## Prioritised Recommendations

### 1. Interactive Onboarding Tutorial — Priority: HIGH | Effort: MEDIUM
**What:** Add a guided, step-by-step tutorial overlay for first-time users in the Lab3D environment.
**Why:** Competitors like PraxiLabs and Labster provide strong guided pathways. This reduces the learning curve and improves initial engagement.
**Where in code:** `client/src/pages/Lab3D.jsx` and new `client/src/components/TutorialOverlay.jsx`
**How:** Implement a state flag (e.g., `hasSeenTutorial` in localStorage or Supabase profile) and a lightweight tooltip component that highlights controls (e.g., chemical sliders, initiate button) sequentially.

### 2. Experiment Data Export (CSV) — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to export experiment history as a CSV file.
**Why:** A table-stakes feature in educational tools for reporting and offline analysis.
**Where in code:** `client/src/pages/history.jsx` (and potentially `TeacherDashboard.jsx`)
**How:** Add an "Export to CSV" button that takes the existing `logs` from `historyStore` and uses a library like Papa Parse or a simple blob generation to download the data.

### 3. Achievement Badges System — Priority: MEDIUM | Effort: MEDIUM
**What:** Introduce a badge system for completing certain milestones (e.g., "First Titration", "Perfect Score").
**Why:** Labster's gamified approach improves engagement by up to 20%. This adds persistence to the existing success celebration.
**Where in code:** `client/src/pages/Profile.jsx` and `client/src/store/authStore.js`
**How:** Add a `badges` array to the user profile schema in Supabase. Create a `BadgeDisplay` component to show earned badges on the Profile and Student Dashboard.

### 4. Text-to-Speech for AI Tutor — Priority: MEDIUM | Effort: SMALL
**What:** Add a voice output option for the AI Tutor's responses.
**Why:** PraxiLabs utilizes voice guidance to cater to auditory learners. This enhances accessibility and immersion.
**Where in code:** `client/src/components/AiTutorPanel.jsx`
**How:** Use the native Web Speech API (`window.speechSynthesis`) to read aloud the AI tutor's text responses when a "Speak" button is toggled.

### 5. Enhanced Titration Curve Visualization — Priority: MEDIUM | Effort: MEDIUM
**What:** Display a real-time or post-experiment graph of pH vs. volume in the Titration module.
**Why:** Visualizing data is crucial for chemistry education, aligning with features in top simulators.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Integrate a charting library (like Recharts, already standard in React ecosystems) to plot the `data.points` against the corresponding volumes or counts when the experiment stops.

### 6. Classroom Leaderboard (Opt-in) — Priority: LOW | Effort: MEDIUM
**What:** A leaderboard in the Student Dashboard showing top scores for assignments.
**Why:** Increases gamification and friendly competition.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and backend stats endpoints.
**How:** Create a leaderboard component that fetches aggregated top scores from `experiment_results` for the user's current classroom.

### 7. Save/Resume Experiment State — Priority: LOW | Effort: LARGE
**What:** Allow users to save an incomplete experiment setup and return later.
**Why:** Useful for complex setups, matching professional simulator capabilities.
**Where in code:** `client/src/store/labStore.js`
**How:** Periodically sync the current state (`chemA`, `chemB`, etc.) to Supabase or `localStorage` and prompt to resume on page load.

### 8. Contextual Equipment Tooltips — Priority: LOW | Effort: SMALL
**What:** Hover tooltips on 3D elements (beakers, flasks) explaining their function.
**Why:** Improves the learning experience without cluttering the UI.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` (and related 3D components).
**How:** Use `react-three-fiber` pointer events (`onPointerOver`) to set a state that displays an HTML tooltip over the canvas.

### 9. Shareable Experiment Links — Priority: LOW | Effort: MEDIUM
**What:** Generate a unique link for a specific experiment result that can be shared with teachers or peers.
**Why:** Facilitates collaboration and easy submission of work.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Add a "Share Result" button that generates a URL with the log ID (e.g., `/result/:id`) and copies it to the clipboard.

### 10. Teacher "View as Student" Mode — Priority: LOW | Effort: SMALL
**What:** Allow teachers to experience the lab exactly as their students do, including classroom restrictions.
**Why:** Helps teachers test assignments before publishing.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add a toggle that temporarily overrides the role-based routing or auth context to load the `StudentDashboard` and Lab.

## Quick Wins (< 1 day each)
1.  **Experiment Data Export (CSV):** Easily achievable using existing store data and browser blob generation.
2.  **Text-to-Speech for AI Tutor:** The Web Speech API is built-in and requires minimal code to implement.
3.  **Contextual Equipment Tooltips:** Simple addition of pointer events and an absolute positioned div.
