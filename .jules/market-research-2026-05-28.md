# Market Research Report
**App:** Alchemistry is a cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** Educational Technology (EdTech) / STEM Virtual Labs
**Date:** 2026-05-28
**Competitors Researched:** PraxiLabs, STEMROBO, WhimsyLabs

## Executive Summary
The virtual chemistry lab market is rapidly evolving from basic click-through simulations to physically accurate sandbox environments powered by AI. Current market leaders differentiate themselves through real-time physics engines, gamified engagement loops, and advanced AI tutoring that doesn't just answer questions, but detects student frustration. For Alchemistry, the biggest opportunity lies in leveraging its existing 3D environment and React stack to implement proactive AI tutoring and personalized practice recommendations.

## Competitor Analysis
*   **WhimsyLabs:** A rising star focusing on "sandbox learning" with real-time liquid physics and an advanced AI tutor ("WhimsyCat") that detects student frustration through interaction vectors. They heavily use daily gamified lab recommendations.
*   **PraxiLabs:** An established player focused on academic accuracy and curriculum alignment. They use gamification (rewards) to keep students motivated and competitive.
*   **STEMROBO:** Focuses on immersive AR/VR and collaborative learning. They highlight the teacher's role as a guide while software provides interactive checkpoints.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Proactive AI Guidance:** Alchemistry has a responsive AI tutor (`AiTutorPanel`), but competitors have AI that actively monitors student actions (e.g., mixing invalid chemicals multiple times) and offers help before they ask.

### Differentiating Opportunities (Stand-out features)
*   **Frustration Detection:** Using the rate of UI interactions or repeated failed experiments to trigger empathetic AI support.
*   **Gamified Daily Recommendations:** Competitors use AI to analyze weak points and suggest specific, low-stakes daily practice labs. Alchemistry's dashboard lacks this dynamic, personalized "what to do next" element.
*   **Sandbox "Freedom to Fail" Analytics:** Tracking what students attempt (even if wrong) to build better learning profiles, rather than just grading "PASS/PENDING" on assignments.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips on First Use:** Highlighting lab tools progressively.
*   **Personalized "Next Best Action" Dashboard Widget:** Prominently displaying a recommended daily lab task immediately upon login.

## Prioritised Recommendations

### 1. Daily Lab Recommendation Widget — Priority: HIGH | Effort: SMALL
**What:** Add a "Daily AI Recommendation" card to the student dashboard that suggests a specific experiment module based on their role or past history.
**Why:** WhimsyLabs and PraxiLabs use daily recommendations and gamification to increase engagement by 48%. It guides students on what to do rather than leaving them in a blank sandbox.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Create a new `DailyRecommendation` component that selects a module from `MODULE_CARDS` based on the day of the week or random selection, and place it above the "EXPERIMENT MODULES" section.

### 2. Proactive AI Tutor Triggers — Priority: HIGH | Effort: MEDIUM
**What:** Make the `AiTutorPanel` automatically pop open or show a subtle notification badge when the user repeatedly fails an experiment or shakes controls rapidly.
**Why:** Top competitors use "frustration detection." An AI that waits to be asked is less effective than one that observes and offers timely help.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `failedAttemptCount` to `labStore`. Increment it when `reactionState === 'error'`. If it hits 3, automatically set `isAiOpen(true)` and pre-fill the chat with a supportive message: "I noticed you're having trouble. Do you want a hint?"

### 3. Gamified Streaks & Rewards — Priority: MEDIUM | Effort: MEDIUM
**What:** Track and display a "Lab Streak" (consecutive days experimenting) on the dashboard.
**Why:** PraxiLabs emphasizes that human brains seek motivation via rewards. Streaks are a proven mechanism to drive daily active usage in EdTech.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/store/authStore.js`
**How:** Add a simple `streakCount` UI element to the dashboard header next to the welcome text, calculating the streak from the `logs` data in `HistoryStore`.

### 4. Interactive "First-Time" Onboarding Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Implement a guided tour for the 3D lab controls the first time a student enters.
**Why:** Sandbox environments can be overwhelming. Standard UX in this market includes contextual help pointing out the acid, base, and initiate buttons.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use a simple `localStorage` flag (`hasSeenLabTour`) and a library like `react-joyride` or custom tooltip overlays to highlight the `slider-grid` and `initiate-reaction-btn`.

### 5. Detailed Failure Analytics (Sandbox Tracking) — Priority: LOW | Effort: LARGE
**What:** Log all failed experiment attempts to the backend, not just successful ones or official assignments.
**Why:** "Freedom to fail" is a core tenet of modern virtual labs. Teachers need to see *how* students fail to correct misconceptions.
**Where in code:** `client/src/store/labStore.js` and `server/controllers/historyController.js`
**How:** Update the `handlePlayClick` logic to always post to `/api/history`, regardless of success, adding a `status: 'failed'` flag to the schema. Update the teacher dashboard to show common failure patterns.

## Quick Wins (< 1 day each)
1.  **Daily Recommendation Widget:** A simple UI addition to the student dashboard to drive immediate engagement.
2.  **Proactive AI Pop-up:** A small state change in the 3D lab to trigger the AI tutor after 3 failed attempts.
3.  **Lab Streak Counter:** Calculate a basic streak from the existing experiment history logs and display it on the dashboard header.
