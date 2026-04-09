# Market Research Report
**App:** A web-based virtual chemistry laboratory built with React and Three.js for interactive 3D experiments.
**Market:** Educational Virtual Science Labs
**Date:** 2024-05-15
**Competitors Researched:** Labster, PraxiLabs, ChemCollective, PhET Interactive Simulations

## Executive Summary
The market for virtual science labs is highly competitive, emphasizing curriculum alignment, accessibility, and integrated assessments. Top products offer game-like experiences with robust teacher controls. Alchemistry has a strong technical foundation with its 3D environment and AI tutor, but lacks integrated knowledge checks, accessibility features for its 3D canvas, and comprehensive experiment setup materials like safety warnings and pre-lab theory. Adding these features will bridge the gap with established competitors.

## Competitor Analysis
*   **Labster:** Focuses on immersive simulations with built-in assessments, automated grading, and pre-read theory. Strong in curriculum integration and teacher dashboards.
*   **PraxiLabs:** Offers curriculum-aligned 3D simulations with an AI lab assistant, custom quiz builders, and real-time performance analytics. Emphasizes safety and gamification.
*   **ChemCollective:** Provides a customizable simulation of aqueous chemistry, extensively used for pre/post-labs and inquiry-based problems. Allows instructors to load specific homework assignments.
*   **PhET Interactive Simulations:** Excels in inclusive design, offering alternative inputs (keyboard navigation), sonification, and interactive descriptions for simulations, making STEM accessible to all.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Pre/Post-Lab Quizzes:** Competitors have integrated assessments to evaluate understanding before and after experiments.
*   **Safety/Cautionary Notes:** Real labs and top virtual labs emphasize safety. Alchemistry lacks explicit warnings for toxic/hazardous chemical combinations.
*   **Pre-Read Theory:** Providing context and theory before the experiment begins.

### Differentiating Opportunities (Stand-out features)
*   **Custom Quiz Builder:** Allowing teachers to create custom knowledge checks linked to specific assignments.
*   **Sonification & Alternative Inputs:** Enhancing the 3D lab accessibility, following PhET's inclusive design principles.

### UX Patterns (Design/interaction patterns common in top products)
*   **Guided Walkthroughs:** Step-by-step guidance, especially for new experiments.
*   **Contextual Tooltips:** Instant feedback and hints during interactions.

## Prioritised Recommendations

### 1. Pre/Post-Lab Quizzes — Priority: HIGH | Effort: MEDIUM
**What:** Add multiple-choice quizzes linked to assignments to test student knowledge.
**Why:** Competitors (Labster, PraxiLabs) heavily feature integrated assessments for grading and comprehension checks.
**Where in code:** `client/src/store/assignmentStore.js` and `client/src/components/student/`
**How:** Extend the `assignmentStore` to fetch quiz data. Create a new `QuizModal` component to display questions before starting or after completing an assignment in `StudentDashboard.jsx`.

### 2. Cautionary Safety Warnings — Priority: HIGH | Effort: SMALL
**What:** Display safety warnings when specific, potentially hazardous chemicals are selected in the lab.
**Why:** Realism and safety are key in chemistry education. PraxiLabs explicitly lists this as a feature.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`
**How:** Add a `safetyWarning` state to `labStore.js`. In `Lab3D.jsx`, display a warning banner near the chemical sliders when specific combinations (e.g., strong acid/base) reach a certain threshold.

### 3. Alternative Keyboard Inputs for 3D Lab — Priority: MEDIUM | Effort: MEDIUM
**What:** Implement keyboard controls for interacting with the 3D lab elements, rather than relying solely on mouse drags.
**Why:** PhET's research highlights alternative inputs as crucial for inclusive design.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Add `tabIndex` and `onKeyDown` handlers to the 3D canvas or an overlay to allow adjusting chemical sliders and initiating reactions via keyboard.

### 4. Sonification of Reactions — Priority: LOW | Effort: SMALL
**What:** Add audio feedback corresponding to the reaction state (e.g., bubbling sound for success, error beep).
**Why:** Another inclusive design feature from PhET that enhances the immersive experience for all users.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Use the Web Audio API or a simple HTML5 audio element triggered by changes in the `reactionState` from `labStore`.

### 5. Pre-Read Theory Modal — Priority: MEDIUM | Effort: SMALL
**What:** Display theoretical background before starting a specific experiment module.
**Why:** Labster and ChemCollective use pre-reads to ensure students understand the concepts before experimenting.
**Where in code:** `client/src/pages/` (e.g., `organic.jsx`, `titration.jsx`)
**How:** Create a `TheoryModal` component that pops up when a user first enters a specific experiment page, storing the 'read' state in `localStorage`.

### 6. Export Results to CSV — Priority: LOW | Effort: SMALL
**What:** Allow students and teachers to export experiment history and results.
**Why:** Standard feature for data analysis in educational tools.
**Where in code:** `client/src/store/historyStore.js` and `client/src/pages/history.jsx`
**How:** Add a 'Download CSV' button in `history.jsx` that converts the `logs` array to CSV format and triggers a download.

### 7. Teacher Assignment Creation Form — Priority: HIGH | Effort: MEDIUM
**What:** A UI for teachers to create new assignments and link them to specific classrooms.
**Why:** Alchemistry has an `assignmentStore` but lacks a UI in the Teacher Dashboard for creation.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and `client/src/components/`
**How:** Create a `CreateAssignmentModal` allowing teachers to select experiment types, target scores, and due dates, hooking into the backend API.

### 8. Contextual Onboarding Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** Introduce new users to the lab interface with guided tooltips.
**Why:** Common UX pattern to reduce the learning curve in complex interfaces.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a lightweight tour library (like react-joyride) or custom absolute-positioned tooltips that appear if a `hasSeenTour` flag is not in `localStorage`.

### 9. Gamified Badges for Milestones — Priority: LOW | Effort: MEDIUM
**What:** Award badges for completing a certain number of experiments or achieving high scores.
**Why:** PraxiLabs uses gamification to drive an 80% improvement in learning retention.
**Where in code:** `client/src/pages/Profile.jsx` and backend user model
**How:** Add a `badges` array to the user profile and display them in the `Profile.jsx` page based on history metrics.

### 10. Direct AI Tutor Prompts for Errors — Priority: LOW | Effort: SMALL
**What:** When a reaction fails, offer a one-click button to send the error context to the AI Tutor.
**Why:** Integrates the existing `AiTutorPanel` more deeply into the user flow for instant remediation.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Add a button in `ResultModal` that opens the AI panel and pre-fills a prompt based on the `reactionError`.

## Quick Wins (< 1 day each)
1. **Cautionary Safety Warnings:** Simple state addition and banner display based on chemical slider values.
2. **Direct AI Tutor Prompts for Errors:** Reusing existing components and state to improve the error recovery flow.
3. **Export Results to CSV:** Straightforward data manipulation of the existing `historyStore` logs.
