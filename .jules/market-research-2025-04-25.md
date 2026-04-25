# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments.
**Market:** EdTech Virtual Science Labs (K-12 & Higher Education)
**Date:** 2025-04-25
**Competitors Researched:** Labster, PraxiLabs, Futuclass, ChemCollective, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is highly focused on increasing student engagement through gamification, providing real-world contexts for theoretical concepts, and offering deep analytics for educators. While Alchemistry has a solid foundation with its 3D interactive environment and AI Tutor, it lacks structured, scenario-based learning paths and detailed performance tracking. Adding guided experiments with built-in assessments and gamified progression will elevate it to compete with industry leaders.

## Competitor Analysis
- **Labster:** Market leader focusing on highly immersive, scenario-based virtual labs. Key differentiator: Gamified storylines (e.g., "Neutralize an acid lake") and comprehensive theory quizzes integrated mid-experiment.
- **Futuclass:** Focused on younger students with a strong puzzle-game approach. Key differentiator: Short, highly interactive 5-10 minute modules designed for classroom activities.
- **PraxiLabs:** Strong focus on realistic lab procedures. Key differentiator: Detailed performance analytics tracking every student action and time spent.
- **ChemCollective / PhET:** Open educational resources. Key differentiator: Scenario-based problem solving and extreme accessibility/ease of use.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Guided Step-by-Step Instructions:** Competitors offer structured workflows. Alchemistry's lab is currently a sandbox.
- **Formative Assessments:** In-lab quizzes before, during, or after experiments to test comprehension.
- **Time Tracking & Action Logging:** Teachers need to know how long an experiment took, not just the final score.

### Differentiating Opportunities (Stand-out features)
- **Gamified Progression:** Badges, streaks, or achievements for completing modules or mixing correct compounds.
- **Real-World Scenarios:** Tying chemical reactions to real-world problems (e.g., environmental cleanup).
- **Interactive Tooltips:** Contextual help during the first use of lab equipment.

### UX Patterns (Design/interaction patterns common in top products)
- **Progress Bars in Labs:** Showing students how far along they are in a specific experiment.
- **Action History Sidebar:** A visible, running log of actions taken during the current lab session.

## Prioritised Recommendations

### 1. Guided Experiment Mode — Priority: HIGH | Effort: LARGE
**What:** Add a structured "Scenario Mode" alongside the current sandbox lab, offering step-by-step instructions to achieve a specific goal.
**Why:** Top competitors like Labster use scenarios to anchor learning. This prevents students from aimlessly moving sliders.
**Where in code:** `client/src/pages/Lab3D.jsx` and new `ScenarioOverlay` component.
**How:** Create a `ScenarioEngine` hook that tracks the current step, required chemical levels, and displays instructions via a new overlay component in the 3D lab.

### 2. Formative Quiz Integration — Priority: HIGH | Effort: MEDIUM
**What:** Introduce mini-quizzes at the start or end of a reaction cycle.
**Why:** Formative assessment is a table-stakes feature for educational software, ensuring concepts are understood, not just simulated.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/Lab3D.jsx`.
**How:** Extend `ResultModal` to include a short multiple-choice question before revealing the final score, or add a `QuizOverlay` triggered before the reaction starts.

### 3. Detailed Teacher Analytics (Time & Actions) — Priority: MEDIUM | Effort: MEDIUM
**What:** Track time spent in the lab and specific slider adjustments made before hitting "Initiate Reaction".
**Why:** Teachers need insight into student struggle. If a student took 30 minutes, they might need help even if they eventually got it right.
**Where in code:** `client/src/store/historyStore.js` and `client/src/pages/TeacherDashboard.jsx`.
**How:** Add start/end timestamps to the lab session state and log them to the backend when saving the history log. Display average completion time in the `TeacherDashboard` analytics.

### 4. Achievement & Badge System — Priority: MEDIUM | Effort: MEDIUM
**What:** Award badges for specific actions (e.g., "First Reaction", "Perfect Acid-Base Mix").
**Why:** Gamification drives engagement, especially in platforms like Futuclass.
**Where in code:** `client/src/pages/Profile.jsx` and `client/src/components/SuccessCelebration.jsx`.
**How:** Add a `badges` array to the user profile schema. When `reactionState === 'success'`, check conditions and trigger a badge unlock notification alongside the existing celebration.

### 5. Contextual Onboarding Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show tooltips pointing to the sliders and AI tutor the first time a user enters the 3D Lab.
**Why:** Reduces cognitive load for new students and highlights features like the AI Tutor.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Use `localStorage` to check a `hasSeenLabTour` flag. If false, render a `TooltipTour` component using a library like `react-joyride` pointing to key UI elements.

### 6. Export Experiment Logs — Priority: LOW | Effort: SMALL
**What:** Allow students and teachers to export history logs as CSV or PDF.
**Why:** Useful for lab reports and grading offline, a common feature in professional and educational tools.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/TeacherDashboard.jsx`.
**How:** Add an "Export" button that uses the existing fetched logs and a lightweight library like `papaparse` to trigger a file download.

### 7. Real-Time Action Log Sidebar — Priority: LOW | Effort: SMALL
**What:** Display a running log of actions (e.g., "Added 50% HCl", "Initiated Reaction") within the 3D lab view.
**Why:** Helps students track their steps and understand the sequence of events, similar to real lab notebooks.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Add an array of action strings to the component state, updated on slider change or button click, and render them in a collapsible sidebar panel.

## Quick Wins (< 1 day each)
1. **Export Experiment Logs:** Fast to implement using existing data and standard CSV formatting.
2. **Contextual Onboarding Tooltips:** Easy to add with `react-joyride` and `localStorage`.
3. **Real-Time Action Log Sidebar:** Purely local state update in the 3D lab UI without backend changes.
