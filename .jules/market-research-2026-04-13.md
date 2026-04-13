# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js that enables students to conduct safe, interactive 3D experiments and gives teachers analytics.
**Market:** EdTech / Virtual Science Laboratory Simulations
**Date:** 2026-04-13
**Competitors Researched:** Labster, PraxiLabs

## Executive Summary
The virtual chemistry lab market is defined by immersive, risk-free simulations that balance freeform exploration with structured curriculum support. Top platforms like Labster and PraxiLabs differentiate themselves through proactive student guidance (scenario-based learning, guided tutorials) and robust teacher tools (performance tracking, LMS integration). Alchemistry has a strong core 3D simulation and AI integration, but trails competitors in proactive onboarding and data export capabilities. The biggest opportunity for Alchemistry is to introduce guided tutorials for new students and actionable data exports for teachers, significantly boosting both student retention and teacher utility.

## Competitor Analysis
- **Labster:** The market leader. Key features include highly structured "guided learning pathways", scenario-based storytelling, immersive VR, and deep teacher analytics. It focuses heavily on ensuring students understand the *why* before mixing.
- **PraxiLabs:** Focuses on accessibility and affordability. Key features include an AI Lab Assistant, real-time tracking, a built-in question bank/quiz builder, and strong focus on gamified retention and instant reporting.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Data Export:** Teachers expect to download student analytics (CSV/Excel) for grading and reporting.
- **Guided Onboarding:** Students expect a step-by-step tutorial when entering a complex 3D environment for the first time.

### Differentiating Opportunities (Stand-out features)
- **Proactive AI Guidance:** Currently, the AI is reactive (hints on demand). A differentiator would be contextual, proactive interventions based on repeated failures.
- **Curriculum Quizzes:** PraxiLabs ties experiments to quizzes. Linking the existing reaction results to a quick knowledge check.

### UX Patterns (Design/interaction patterns common in top products)
- **Progress Gamification:** Using visual progress bars or badges to track "Lab Mastery" rather than just listing past experiments.
- **Scenario Context:** Framing experiments with a real-world scenario (e.g., "Test this water sample") instead of a blank sandbox.

## Prioritised Recommendations

### 1. Analytics CSV Export for Teachers — Priority: HIGH | Effort: SMALL
**What:** Add an "Export CSV" button to the Teacher Dashboard.
**Why:** Table-stakes feature for educators to integrate virtual lab scores into their external gradebooks.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** The `experimentScores` and table data are already loaded client-side. Add an `ExportButton` component that uses Papa Parse or a simple Blob/URL.createObjectURL script to map the state to a downloadable CSV.

### 2. Guided Interactive Lab Onboarding — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step guided tour on the first visit to the Lab3D page.
**Why:** Competitors use guided pathways to prevent student confusion. Alchemistry drops them into the UI with just a short toast message.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Introduce a `hasSeenTutorial` flag in localStorage. If false, display a sequence of targeted tooltips (e.g., using `react-joyride` or custom overlays) pointing to the chemical sliders, the initiate button, and the AI tutor.

### 3. Gamified "Lab Mastery" Progress — Priority: MEDIUM | Effort: SMALL
**What:** Add a visual progress indicator on the Student Dashboard summarizing their lab activity.
**Why:** Gamification is proven to increase retention in virtual labs (PraxiLabs cites 80% improved retention).
**Where in code:** `client/src/pages/StudentDashboard.jsx` & `client/src/store/historyStore.js`
**How:** Query the `historyLogs` length. Display a progress bar tracking towards milestones (e.g., "Novice Chemist: 5 Experiments", "Scholar: 20 Experiments") on the Student Dashboard above the module cards.

### 4. Scenario-Based Experiment Framing — Priority: LOW | Effort: MEDIUM
**What:** Provide real-world "missions" instead of just a blank sandbox.
**Why:** Labster's storytelling approach heavily drives engagement.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a "Mission Board" modal that gives a prompt (e.g., "Mission: Neutralize the acid spill"). This can just be text state initially, optionally verified by checking the `reactionResult`.

## Quick Wins (< 1 day each)
1. **Analytics CSV Export:** Data is already in memory; requires only a ~30 line export function.
2. **Gamified Progress Bar:** History logs are already fetched; requires only UI mapping on the dashboard.
3. **Proactive AI Hint Toast:** Automatically show the AI hint toast if a student spends > 2 minutes in Lab3D without initiating a reaction (using a simple `setTimeout`).
