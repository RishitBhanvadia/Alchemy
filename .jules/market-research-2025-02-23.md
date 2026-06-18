# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Educational Technology (EdTech) / Virtual Science Labs
**Date:** 2025-02-23
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market (dominated by Labster and PraxiLabs) relies heavily on immersive 3D simulations, real-time safety and pedagogical feedback, and deep LMS/Classroom integration. Alchemistry has a solid foundation with its 3D environment (React Three Fiber) and user roles (Teacher/Student), but lacks critical scaffolding features that competitors use to guide learning, such as built-in quizzes, explicit safety protocols (PPE simulation), and step-by-step contextual onboarding. By adding these expected features and focusing on gamified feedback, Alchemistry can close the gap with established market leaders.

## Competitor Analysis
1. **Labster:** The market leader. Known for highly gamified, story-driven 3D lab simulations. Key differentiator: Deep narrative context for experiments and extensive formative assessments (quizzes) during the simulation.
2. **PraxiLabs:** Focuses on university and high school 3D labs. Key differentiator: AI Lab Assistant ("Oxi"), custom quiz builders, and strong performance analytics for teachers.
3. **PhET Interactive Simulations:** 2D interactive math and science simulations. Key differentiator: Highly intuitive, free, exploratory sandbox environments rather than strict 3D realism.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Contextual Onboarding / Tooltips:** First-time users in 3D spaces often get lost without explicit UI guides.
- **Safety Protocol Simulation:** Real chemistry labs require PPE (goggles, gloves); virtual labs use this as a teaching moment before experiments begin.
- **Formative Assessment (In-Lab Quizzes):** Testing knowledge *during* the experiment, not just looking at the final result.

### Differentiating Opportunities (Stand-out features)
- **Gamified Progression:** XP or badges for successfully completing experiments or discovering hidden reactions.
- **Exportable Lab Reports:** Allowing students to generate a PDF/CSV of their experiment log for submission.

### UX Patterns (Design/interaction patterns common in top products)
- **Persistent AI/Help Assistant:** PraxiLabs uses "Oxi". Alchemistry has an `AiTutorPanel`, which is a great start and should be highlighted or expanded.
- **Visual Status Indicators:** Clear visual feedback on current step/progress in a multi-step experiment.

## Prioritised Recommendations

### 1. Lab Safety Check (PPE Virtual Requirement) — Priority: HIGH | Effort: SMALL
**What:** Require students to click a "Put on Safety Goggles/Gloves" toggle before the "INITIATE REACTION" button becomes active.
**Why:** Standard safety protocol in all top virtual labs (Labster makes this a mandatory first step). It reinforces real-world lab safety.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `safetyGearOn` boolean state. Add a toggle UI above the controls. Disable the reaction button if `!safetyGearOn`.

### 2. Contextual Onboarding (First-Time Tour) — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step tooltip tour when a user first enters the 3D lab.
**Why:** 3D interfaces can be confusing. Top competitors use guided tours to reduce cognitive load.
**Where in code:** `client/src/pages/Lab3D.jsx` & `client/src/store/profileStore.js`
**How:** Add a `hasSeenLabTour` flag to the user profile or `localStorage`. Use a lightweight library (or custom absolute-positioned popovers) to highlight the sliders, the reaction button, and the AI Tutor.

### 3. In-Lab Formative Quizzes — Priority: MEDIUM | Effort: MEDIUM
**What:** A quick multiple-choice question presented before revealing the final result of a complex reaction.
**Why:** Labster's core loop relies on testing hypothesis *before* showing the result to ensure active learning.
**Where in code:** `client/src/components/ResultModal.jsx` or `client/src/pages/Lab3D.jsx` (during the `loading` state).
**How:** When `reactionState === 'loading'`, pause the result and show a small modal asking "What do you expect the outcome to be?" Compare their answer to the actual result for bonus points.

### 4. Exportable Lab Reports — Priority: MEDIUM | Effort: SMALL
**What:** Ability to export experiment history to CSV or PDF.
**Why:** Teachers often require formal lab reports. Praxilabs and Labster integrate deeply with LMS for grading; an export feature is a lightweight alternative.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that takes the `logs` array, formats it to CSV using standard browser Blob/URL APIs, and triggers a download.

### 5. Gamification / Achievement Badges — Priority: MEDIUM | Effort: LARGE
**What:** Award badges for discovering specific chemical reactions (e.g., "Explosion Master", "Perfect Titration").
**Why:** Gamification drives engagement and retention, a key selling point for Labster.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and backend `supabase` schema.
**How:** Add an `achievements` table. Check reaction outcomes against achievement criteria. Display badges in a new section on the Student Dashboard.

### 6. Teacher Analytics Dashboard Enhancements — Priority: MEDIUM | Effort: MEDIUM
**What:** Show which experiments students are failing most often or asking the AI Tutor about.
**Why:** PraxiLabs emphasizes actionable insights for teachers.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/StudentAnalyticsChart.jsx`
**How:** Aggregate failure states or AI tutor API calls by classroom. Add a "Common Stumbling Blocks" widget to the Teacher Dashboard.

### 7. Step-by-Step Guided Experiments — Priority: LOW | Effort: LARGE
**What:** Instead of a pure sandbox, offer "Recipes" or guided tracks where users must add chemicals in a specific sequence.
**Why:** Provides structure for lower-level students who might get overwhelmed by a sandbox.
**Where in code:** `client/src/pages/Lab3D.jsx` and a new `client/src/store/recipeStore.js`
**How:** Define JSON structures for experiments. Highlight the correct slider/chemical to use next.

### 8. Improved Error State Pedagogy — Priority: LOW | Effort: SMALL
**What:** When an experiment fails or results in a neutral outcome, automatically prompt the AI Tutor to explain why.
**Why:** Turn failures into learning opportunities rather than just showing a "Failed" badge.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** If `reactionResult.outcome_label` is empty or generic, auto-open the `AiTutorPanel` with a pre-filled prompt like "Why didn't this react?"

### 9. Interactive Equipment Familiarization — Priority: LOW | Effort: MEDIUM
**What:** A module purely for learning about lab equipment (Beakers, Bunsen Burners, Pipettes).
**Why:** Before doing reactions, students need to know their tools.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (New Module Card)
**How:** Create a new page similar to `Lab3D.jsx` but focused on clicking on equipment to see its name, use case, and safety warnings.

### 10. Real-time Collaboration (Multiplayer Lab) — Priority: LOW | Effort: MASSIVE
**What:** Let two students manipulate the same 3D lab environment.
**Why:** Simulates real-world lab partners.
**Where in code:** Global architecture (WebSockets/Supabase Realtime).
**How:** Sync Three.js state across clients via Supabase Realtime presence channels. (Note: Recommend keeping priority low due to complexity, but it is a massive differentiator if built).

## Quick Wins (< 1 day each)
1. **Lab Safety Check:** Add a simple checkbox to `Lab3D.jsx` that enables the Initiate Reaction button.
2. **Exportable Lab Reports:** Add a CSV export button to the History page.
3. **Improved Error State Pedagogy:** Auto-trigger the AI Tutor on neutral/failed reactions.
