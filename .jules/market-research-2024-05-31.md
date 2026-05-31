# Market Research Report
**App:** Alchemistry is a web-based 3D virtual chemistry laboratory enabling students to conduct interactive experiments with AI tutoring, assignment tracking, and teacher dashboards.
**Market:** EdTech Virtual Labs / Chemistry Education Software
**Date:** 2024-05-31
**Competitors Researched:** ChemCollective, PraxiLabs, Futuclass

## Executive Summary
The EdTech virtual science lab market is highly competitive, emphasizing realistic 3D interaction and strong educator assessment tools. Alchemistry already features a strong 3D environment and an AI tutor. The largest opportunities lie in adopting standard accessibility/safety protocols present in all competitors, offering gamified assessments, and improving experiment export options for assignment submission.

## Competitor Analysis
- **ChemCollective**: Focuses on broad scenario-based general chemistry. Differentiates with strong assignment grading and extensive worksheet generation.
- **PraxiLabs**: Highly comprehensive virtual lab environment for universities. Differentiates with strict safety procedures (e.g., PPE selection) and deep assessment quizzes inside the lab.
- **Futuclass**: Gamified VR chemistry. Differentiates with extremely engaging 5-10 minute modular puzzles and instant visual feedback loops.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Virtual Safety Gear (PPE) Check**: Competitors force students to put on virtual goggles/gloves before interacting with chemicals.
- **Experiment Data Export**: Competitors allow exporting results to CSV/PDF for submission to LMS systems.

### Differentiating Opportunities (Stand-out features)
- **In-Lab Quiz Checkpoints**: Rather than just mixing chemicals, stopping the student to ask a multiple choice question to ensure understanding.
- **Gamified Achievements**: Rewarding badges for specific difficult reactions.

### UX Patterns (Design/interaction patterns common in top products)
- **Contextual Tooltips on Hover**: Describing the chemical properties (pH, hazard level) when hovering over a flask.
- **Step-by-Step Procedure Checklist**: A persistent sidebar checklist that crosses off steps as the student progresses.

## Prioritised Recommendations

### 1. Lab Safety PPE Pre-Check — Priority: HIGH | Effort: SMALL
**What:** Require students to toggle on "Virtual Goggles" and "Gloves" before the "Initiate Reaction" button becomes active.
**Why:** Expected in all educational virtual labs to reinforce real-world safety.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/PhysicsLab.jsx` (add state for PPE).
**How:** Add a simple UI toggle for PPE. Disable the reaction button and sliders until checked.

### 2. Export Experiment Results to CSV — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the Student Dashboard and History pages.
**Why:** Standard requirement for submitting work to external LMS systems.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/StudentDashboard.jsx`.
**How:** Map the `logs` state in `useHistoryStore` to a CSV string and trigger a file download using standard browser APIs.

### 3. Hover Tooltips for Chemical Properties — Priority: MEDIUM | Effort: SMALL
**What:** Show hazard and property information when hovering over chemical sliders.
**Why:** Improves learning by providing contextual data without leaving the lab screen.
**Where in code:** `client/src/pages/Lab3D.jsx` (slider-card elements).
**How:** Add `title` attributes or a custom tooltip component to the `slider-card` divs explaining properties (e.g., "HCl: Strong acid, corrosive").

### 4. Interactive Lab Checklist — Priority: MEDIUM | Effort: MEDIUM
**What:** A sidebar checklist indicating expected steps (e.g., "Set Acid > 50%", "Add Catalyst").
**Why:** Guides students through complex assignments without relying solely on the AI tutor.
**Where in code:** `client/src/pages/Lab3D.jsx`.
**How:** Create a new `LabChecklist.jsx` component that reads current chemical states and assignment requirements, crossing off items as slider values match targets.

### 5. Gamified "First Discovery" Badges — Priority: LOW | Effort: MEDIUM
**What:** Toast notifications when a user discovers a specific reaction outcome for the first time.
**Why:** Increases engagement, seen in Futuclass.
**Where in code:** `client/src/pages/Lab3D.jsx` (success state handling).
**How:** Check `reactionResult` against a list of known outcomes in `localStorage` or user profile, triggering a celebratory toast for new ones.

## Quick Wins (< 1 day each)
1. Lab Safety PPE Pre-Check UI (disabling interaction until acknowledged).
2. Export Experiment Results to CSV (client-side data formatting).
3. Hover Tooltips for Chemical Properties (static content additions).
