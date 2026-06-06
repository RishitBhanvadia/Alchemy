# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory built with React and Three.js, enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** EdTech STEM / Virtual Science Laboratories
**Date:** 2026-06-06
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations, VRLab Academy, Gizmos

## Executive Summary
The virtual science lab market is highly focused on combining realistic 3D environments with structured, guided learning and performance analytics. Alchemistry has a strong technical foundation (Three.js, React, Supabase) and essential interactive components like the `AiTutorPanel` and student dashboards. However, compared to market leaders like Labster and PraxiLabs, it lacks structured lab walkthroughs, detailed data export for educators, and built-in post-lab assessments. The highest opportunity lies in leveraging the existing `assignmentStore` and `historyStore` to implement gamification and comprehensive performance reporting, which are table stakes in this domain.

## Competitor Analysis
*   **Labster:** Market leader in university and high school virtual labs. Differentiates with highly narrative, game-like scenarios and strict structured workflows.
*   **PraxiLabs:** Focuses on immersive 3D simulations with built-in AI assistants ("Oxi"), performance analytics, and a custom quiz builder integrated directly into the labs.
*   **PhET Interactive Simulations:** Free, widely used 2D/3D interactive sims. Known for intuitive, exploratory "sandbox" learning without strict narratives.
*   **VRLab Academy & Gizmos:** Focus heavily on curriculum alignment and extensive libraries of modular experiments with strong assessment tools.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Walkthroughs:** Current `Lab3D` relies heavily on unstructured exploration or hints from `AiTutorPanel`. A guided, step-by-step UI is expected.
*   **Results Export:** Teachers and students expect to download lab results (PDF/CSV) for assignments.
*   **Assessment/Quizzes:** Post-lab questions integrated into the experiment flow.

### Differentiating Opportunities (Stand-out features)
*   **Gamification & Badges:** Rewarding students upon successfully passing experiments to increase retention.
*   **Teacher Analytics Dashboard:** Aggregated data on classroom performance.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips:** UI highlighting for next steps.
*   **Real-time Progress Bars:** Visible tracking of experiment completion percentage.

## Prioritised Recommendations

### 1. Gamified Badges Panel — Priority: HIGH | Effort: MEDIUM
**What:** Display earned badges on the Student Dashboard for completed experiments.
**Why:** Gamification drives retention (PraxiLabs feature). The `StudentDashboard` currently shows "PASS/PENDING" but lacks visual rewards.
**Where in code:** `client/src/pages/StudentDashboard.jsx`.
**How:** Create a `BadgesPanel` component that filters the logs from `useHistoryStore` for successful outcomes and maps them to visual badge icons.

### 2. Lab Report Export (CSV/PDF) — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to export their experiment history.
**Why:** Competitors like Tutorbase and PraxiLabs emphasize trackable reporting. Alchemistry has `historyStore` but no export function.
**Where in code:** `client/src/pages/StudentDashboard.jsx` and `client/src/components/ClassroomManager.jsx`.
**How:** Add an `ExportButton` component using Papa Parse to map the existing logs array from `useHistoryStore(state => state.logs)` into a CSV download.

### 3. Contextual First-Run Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** An onboarding overlay highlighting UI elements on first visit.
**Why:** Common UX pattern to ease users into complex 3D interfaces without reading manuals.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Introduce a `hasSeenLabTour` flag in `localStorage` and use a simple tooltip component to highlight the `AiTutorPanel` and chemical selection tools.

### 4. Real-time Experiment Progress Bar — Priority: LOW | Effort: SMALL
**What:** A visual progress bar reflecting steps completed in a structured assignment.
**Why:** Provides clear expectations (common in Labster).
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Calculate progress using `labStore` state vs assignment requirements and render a simple CSS progress bar.

### 5. Glossary / Reference Panel — Priority: LOW | Effort: SMALL
**What:** A slide-out panel defining chemical terms.
**Why:** PhET relies heavily on accessible reference material.
**Where in code:** `client/src/components/Navbar.jsx` or `client/src/pages/Lab3D.jsx`.
**How:** Create a static `ReferencePanel` component that lists key terms.

### 6. Voice Integration for AI Tutor — Priority: LOW | Effort: MEDIUM
**What:** Text-to-speech for the `AiTutorPanel`.
**Why:** Improves accessibility and immersion.
**Where in code:** `client/src/components/AiTutorPanel.jsx`.
**How:** Implement the native Web Speech API to read out AI responses.

## Quick Wins (< 1 day each)
1. Lab Report Export (CSV/PDF)
2. Contextual First-Run Tooltips
3. Gamified Badges Panel
