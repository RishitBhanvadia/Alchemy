# Market Research Report
**App:** Alchemistry is a 3D virtual chemistry laboratory platform for students to conduct experiments safely and teachers to manage classes.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2024-05-30
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz

## Executive Summary
The virtual science laboratory market emphasizes immersive 3D interactions, gamification, and robust analytics. While Alchemistry excels in its core 3D simulation and physics engine, it lags behind top competitors in student-facing analytics, structured onboarding, and comprehensive assessment features.

## Competitor Analysis
- **Labster:** Dominates with immersive 3D virtual labs, gamified assessments, and detailed reporting features, tightly integrated with LMS platforms.
- **PraxiLabs:** Focuses on practice-centric simulations with an AI assistant ("Oxi"), custom quiz builders, and in-depth performance tracking.
- **Beyond Labz:** Offers photorealistic, open-ended laboratory environments focusing heavily on advanced chemistry accuracy.

## Gap Analysis
### Table Stakes
- Pre/post-experiment quizzes to test conceptual knowledge.
- Exportable experiment reports for grading or external review.

### Differentiating Opportunities
- Personal analytics dashboard for students to track their own progress.
- Gamified achievement systems (badges) to motivate continuous learning.

### UX Patterns
- Step-by-step interactive walkthroughs for new users encountering the 3D lab environment.

## Prioritised Recommendations

### 1. Student Personal Analytics View — Priority: HIGH | Effort: MEDIUM
**What:** A visual representation of a student's own scores and experiment history.
**Why:** Competitors provide detailed feedback. Currently, `StudentAnalyticsChart.jsx` is used mainly by teachers. Students need to see their own growth.
**Where in code:** `client/src/pages/StudentDashboard.jsx` (Add a new chart component or adapt `StudentAnalyticsChart.jsx`).
**How:** Pass the student's own scores from `historyStore.js` into a specialized or adapted chart component.

### 2. Gamification & Achievement Badges — Priority: HIGH | Effort: MEDIUM
**What:** Visual badges awarded for completing experiments or achieving high scores.
**Why:** Labster uses gamified elements to boost engagement. The codebase has `achievements` in `client/src/store/profileStore.js`, but they aren't prominently displayed in the student dashboard.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/Profile.jsx`.
**How:** Create a `BadgesPanel` component that reads from `useProfileStore` and displays earned badges.

### 3. Interactive Lab Walkthrough Tutorial — Priority: HIGH | Effort: LARGE
**What:** A guided, step-by-step tour of the 3D lab interface for first-time users.
**Why:** Competitors like PraxiLabs offer walkthrough videos/guides. Alchemistry has a "note-warn" and AI Tutor, but a formal tour would reduce the learning curve.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Integrate a library like `react-joyride` or build a custom overlay system to highlight the chemical sliders and the "Initiate Reaction" button.

### 4. Pre/Post-Lab Quizzes — Priority: MEDIUM | Effort: LARGE
**What:** Short quizzes before or after an experiment to validate learning.
**Why:** PraxiLabs features a "Custom Quiz Builder". Alchemistry only tracks lab "scores" randomly or by result.
**Where in code:** `client/src/store/assignmentStore.js` and a new `QuizModal.jsx`.
**How:** Extend the assignment schema to include quiz questions and display a modal before the reaction starts or after it finishes.

### 5. Exportable Lab Reports (PDF/CSV) — Priority: MEDIUM | Effort: SMALL
**What:** A button to download a student's experiment history.
**Why:** A table-stakes feature for educational tools to allow students to submit work externally.
**Where in code:** `client/src/pages/history.jsx`.
**How:** Use a library like `papaparse` to convert `historyLogs` to CSV and trigger a download.

### 6. Comprehensive Lab Manual/Reference — Priority: MEDIUM | Effort: SMALL
**What:** An accessible reference guide detailing chemical properties and expected reactions.
**Why:** Reduces the need to rely solely on the AI tutor and provides structured learning material.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add a sliding panel or modal containing static markdown/HTML content about the available chemicals.

### 7. Teacher Custom Experiment Builder — Priority: MEDIUM | Effort: LARGE
**What:** An interface for teachers to define specific chemical combinations and expected outcomes as assignments.
**Why:** Increases platform flexibility for educators.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Create a form that updates the `assignments` table with required chemicals and thresholds.

### 8. Accessibility Improvements (Screen Reader Enhancements) — Priority: HIGH | Effort: SMALL
**What:** Enhanced ARIA labels and focus management in the 3D canvas wrappers.
**Why:** Ensures compliance with educational accessibility standards.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/*`.
**How:** Review and expand the existing `aria-live` and `sr-only` elements to cover all interactive controls comprehensively.

### 9. Real-time Collaboration/Multiplayer Lab — Priority: LOW | Effort: LARGE
**What:** Allow multiple students to interact in the same 3D lab environment simultaneously.
**Why:** A highly differentiating feature for remote group work.
**Where in code:** `client/src/pages/Lab3D.jsx` and Supabase realtime subscriptions.
**How:** Use Supabase presence and broadcast features to sync chemical slider states across clients.

### 10. LMS Integration (LTI/Canvas) — Priority: LOW | Effort: LARGE
**What:** Seamless integration with popular Learning Management Systems for roster and grade sync.
**Why:** Crucial for widespread institutional adoption.
**Where in code:** `server/` or a new LTI provider module.
**How:** Implement LTI 1.3 standards to handle authentication and grade passback.

## Quick Wins (< 1 day each)
1. Exportable Lab Reports (CSV export in history).
2. Accessibility Improvements (ARIA label updates).
3. Comprehensive Lab Manual (Static reference panel).
