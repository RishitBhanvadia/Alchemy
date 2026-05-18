# Market Research Report
**App:** Alchemistry - A web-based virtual chemistry laboratory using React and Three.js for interactive student experiments.
**Market:** EdTech / Virtual Science Lab Simulations
**Date:** 2024-05-18
**Competitors Researched:** Labster, Futuclass, ChemCollective Virtual Lab

## Executive Summary
Alchemistry offers a visually impressive 3D sandbox environment. However, top competitors in the EdTech space succeed by bridging the gap between open experimentation and structured curriculum delivery. The biggest opportunities for Alchemistry lie in adding guided student onboarding to the 3D lab and providing teachers with robust, exportable analytics from their dashboard.

## Competitor Analysis
* **Labster:** Industry leader. Heavy focus on guided, gamified scenarios and deep LMS integration.
* **Futuclass:** VR/desktop solution focusing on short, interactive modules (5-10 minutes) with instant feedback.
* **ChemCollective Virtual Lab:** Free, simpler graphics, but strong pedagogical focus with structured problem-solving scenarios.

## Gap Analysis
### Table Stakes
* Exportable grades/progress for teachers (Missing from Alchemistry).
* Contextual tooltips or guided onboarding for the lab environment (Missing).

### Differentiating Opportunities
* Gamified quick-challenges (5-minute balancing equations).
* AI-assisted contextual hints within the 3D lab (Alchemistry has a global AI hint system via tooltips, but could be integrated contextually into objects).

### UX Patterns
* Competitors use step-by-step floating checklists for lab procedures. Alchemistry relies on a global module view.

## Prioritised Recommendations

### 1. CSV Data Export for Teachers — Priority: HIGH | Effort: SMALL
**What:** Allow teachers to download analytics data as a CSV file.
**Why:** Expected by educators to integrate with their own grading books or LMS (Table Stakes).
**Where in code:** `client/src/pages/TeacherDashboard.jsx` (near the `#analytics-section` and data grids).
**How:** Add a "Download CSV" button that converts the local state data feeding the analytics grid into a downloadable Blob or using the PapaParse library.

### 2. Guided Onboarding Overlay — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step contextual tooltip tour when a student first enters the 3D lab.
**Why:** Reduces cognitive overload. Top competitors use guided flows to prevent "sandbox paralysis."
**Where in code:** `client/src/pages/Lab3D.jsx` and state in `localStorage`.
**How:** Add a `hasSeenOnboarding` check to `localStorage`. Use a library like `react-joyride` or a custom Framer Motion overlay component to highlight key lab controls.

### 3. Step-by-step Floating Checklist — Priority: MEDIUM | Effort: MEDIUM
**What:** Instead of just a sandbox, provide a floating, checkable list of objectives.
**Why:** Bridges the gap between open-play and structured learning (like Futuclass).
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/pages/Lab3D.jsx` (to display the checklist).
**How:** Render a floating, draggable UI component in the 3D view using `react-three/drei`'s `Html` component that updates as experiment goals are met.

## Quick Wins (< 1 day each)
1. Add CSV Export button to `TeacherDashboard.jsx`.
2. Implement a basic `localStorage`-based welcome modal in `Lab3D.jsx`.
3. Add a "Share Results" link for students to easily copy their experiment outcome to clipboard.
