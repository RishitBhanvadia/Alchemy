# Market Research Report
**App:** Alchemistry is a web-based, interactive 3D virtual chemistry laboratory that enables students to conduct safe experiments and allows teachers to manage classrooms and track student progress.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-03-19
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry laboratory market is increasingly shifting towards gamified, data-driven platforms that integrate seamlessly into existing educational workflows. While Alchemistry has a strong foundation with its interactive 3D environments (Three.js) and basic teacher dashboards, top competitors like Labster and PraxiLabs differentiate themselves through structured learning pathways, AI-assisted guidance, and comprehensive assessment tools. The biggest opportunity for Alchemistry lies in adding formative assessment features (like in-lab quizzes) and improving the onboarding experience to match industry standards without requiring major architectural changes.

## Competitor Analysis
*   **Labster:** The market leader, focusing on immersive, narrative-driven simulations. Key differentiators include high-fidelity graphics, gamified storylines, and built-in formative assessments (quizzes) during experiments.
*   **PraxiLabs:** Focuses on accessibility and institutional integration. Key features include an AI Lab Assistant ("Oxi") for real-time guidance, custom quiz builders for teachers, and detailed performance analytics tracking every student action.
*   **ChemCollective:** A more traditional, free alternative. Differentiates on purely computational accuracy and open-ended exploration, though it lacks the modern 3D UI and gamification of Labster or Alchemistry.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **In-Experiment Guidance/Tooltips:** Competitors provide step-by-step contextual guidance. Alchemistry's UI relies on exploration but lacks a structured onboarding or "hints" system.
*   **Formative Assessments (Quizzes):** Competitors test knowledge *during* or immediately *after* the simulation. Alchemistry tracks "completion" and "XP" but doesn't explicitly test theoretical understanding.

### Differentiating Opportunities (Stand-out features)
*   **Exportable Reports:** Teachers need to export data for LMS integration or gradebooks. Currently, Alchemistry's dashboard shows data but lacks an export function.
*   **Gamified Achievements/Badges UI:** While the codebase tracks `badges_earned` based on experiment count, there isn't a dedicated UI to showcase specific achievements, which is a core engagement driver in top platforms.

### UX Patterns (Design/interaction patterns common in top products)
*   **Persistent "Lab Assistant" Panel:** A collapsible sidebar or floating assistant that provides context, formulas, or hints without obstructing the 3D view.
*   **Real-time Progress Indicators:** Showing exactly how far along a student is in a specific experiment module.

## Prioritised Recommendations

### 1. In-Experiment Contextual Hints (Lab Assistant) — Priority: HIGH | Effort: MEDIUM
**What:** Add a collapsible "Assistant" panel to the 3D lab view that provides current step instructions and chemical formulas.
**Why:** Top competitors (PraxiLabs, Labster) use persistent guidance to prevent students from getting stuck, improving completion rates.
**Where in code:** `client/src/pages/Lab3D.jsx` (or the specific lab component) and a new `client/src/components/LabAssistant.jsx`.
**How:** Create a React component that reads the current experiment state from a Zustand store and displays relevant hints or the next expected action.

### 2. CSV Data Export for Teachers — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the Teacher Dashboard to export student progress and XP data.
**Why:** Standard table-stakes feature for EdTech. Teachers need to move data into their primary gradebooks (Canvas, Blackboard).
**Where in code:** `client/src/pages/TeacherDashboard.jsx`.
**How:** Add a button near the search input that uses the existing `students` array and a library like Papa Parse (or basic JS string manipulation) to generate and download a CSV file.

### 3. Pre/Post-Experiment Knowledge Checks — Priority: MEDIUM | Effort: MEDIUM
**What:** Introduce a simple modal quiz before starting or after completing a module.
**Why:** Differentiates from just "clicking around" by validating theoretical understanding, a key selling point for institutional adoption (like PraxiLabs' custom quizzes).
**Where in code:** `client/src/pages/Result.jsx` or `client/src/pages/StudentDashboard.jsx`.
**How:** Add a modal component that renders 3-5 multiple-choice questions related to the selected module before granting the XP/completion status.

### 4. Dedicated Achievements Showcase — Priority: MEDIUM | Effort: SMALL
**What:** Expand the Profile or Dashboard to visually display earned badges rather than just a count.
**Why:** Gamification drives student engagement (Labster's core strategy). The backend already calculates `badges_earned` (1 per 5 experiments).
**Where in code:** `client/src/pages/Profile.jsx` and/or `client/src/pages/StudentDashboard.jsx`.
**How:** Map the `badges_earned` integer to an array of visual badge icons (e.g., "Novice Mixer", "Pro Titrator") and render them in a grid layout.

### 5. Interactive Periodic Table Reference — Priority: LOW | Effort: MEDIUM
**What:** An accessible, interactive periodic table modal available during experiments.
**Why:** Students frequently need to look up atomic weights or valences during inorganic/organic labs. Keeping them in-app reduces distraction.
**Where in code:** `client/src/components/Navbar.jsx` (as a global tool) or within specific lab pages.
**How:** Create a `PeriodicTableModal` component using existing CSS grid layouts to display elements and their basic properties.

## Quick Wins (< 1 day each)
1.  **CSV Export for Teachers:** Easily implementable using the already formatted data in the Teacher Dashboard's TanStack table.
2.  **Achievements UI:** Visually representing the existing `badges_earned` logic requires purely frontend CSS/component work with no backend changes.
3.  **Basic Lab Assistant Panel:** A simple static sidebar in the 3D lab that lists the overarching goal of the selected experiment.
