# Market Research Report
**App:** A virtual chemistry laboratory enabling students to conduct safe, interactive 3D chemistry experiments.
**Market:** EdTech / Virtual Lab Software
**Date:** 2026-05-11
**Competitors Researched:** Labster, PhET Interactive Simulations, Practical Action Virtual Labs

## Executive Summary
The virtual science lab market has shifted from sandbox simulations to structured, guided learning workflows that emphasize continuous assessment and accessibility. Alchemistry provides an impressive 3D sandbox and an AI tutor, positioning it well in the space. However, compared to market leaders, it lacks structural onboarding, accessible data export for teachers, and built-in procedural checkpoints. Implementing these standard features will significantly increase its viability as a primary educational tool.

## Competitor Analysis
- **Labster:** Leads the market with highly structured, guided simulation workflows, integrated assessment checkpoints, and deep LMS integrations.
- **PhET Interactive Simulations:** Excels in immediate, interactive variable manipulation for inquiry-based instruction with real-time feedback.
- **Practical Action Virtual Labs:** Focuses on topic-specific, curriculum-aligned virtual experiments with strong narrative structures.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Structured onboarding/tutorials for first-time lab use.
- Exportable experiment data (CSV/PDF) for offline grading.
### Differentiating Opportunities (Stand-out features)
- Step-by-step experiment "recipes" or guided checklists to prevent aimless mixing.
- Integrated assessment checkpoints directly within the 3D lab environment.
### UX Patterns (Design/interaction patterns common in top products)
- Highlighted UI elements during onboarding.
- Clear, prominent data export buttons in history/analytics views.
- Visual indicators for experimental progress or completion.

## Prioritised Recommendations

### 1. Lab Onboarding Tooltips — Priority: HIGH | Effort: SMALL
**What:** Add contextual tooltips on first use of key lab features (e.g., adding chemicals, initiating reactions).
**Why:** Competitors heavily feature guided introductory workflows to prevent user confusion. Our codebase lacks onboarding state.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `hasSeenLabTip` flag to `localStorage` and implement a simple `Tooltip` component that wraps the chemical selectors and "Initiate Reaction" button on first visit.

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow students and teachers to download their experiment logs.
**Why:** All top tools in this space support data export for assessment. Our `useHistoryStore` already fetches full log arrays.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that uses the existing `logs` array and a library like Papa Parse to generate and download a CSV file.

### 3. Guided Experiment "Recipes" — Priority: MEDIUM | Effort: MEDIUM
**What:** A toggleable checklist of steps for standard reactions (e.g., "Mix NaOH and HCl").
**Why:** PhET and Labster provide structured inquiry paths. Currently, Alchemistry is purely free-form.
**Where in code:** `client/src/components/AiTutorPanel.jsx` or a new `ExperimentGuide.jsx`
**How:** Create a predefined list of valid reactions (based on backend logic) and display a step-by-step checklist UI overlay in the lab that checks off as `chemA`, `chemB`, etc. are selected.

### 4. Real-time Safety Warnings — Priority: MEDIUM | Effort: SMALL
**What:** Proactive warnings when dangerous combinations are selected *before* the reaction is initiated.
**Why:** Labster emphasizes procedural safety training. We only show "DANGEROUS" *after* the reaction in `ResultModal.jsx`.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Evaluate the selected `chemA` and `chemB` against a client-side safety mapping (or a new fast API check) and display a warning banner above the "Initiate Reaction" button if a dangerous mix is pending.

### 5. Quick Reset / Undo Button — Priority: LOW | Effort: SMALL
**What:** A button to instantly clear selected chemicals without waiting for a reaction or full lab reset.
**Why:** PhET allows rapid variable manipulation and resets.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a "Clear Selection" button next to the chemical dropdowns that calls `setChemA(null)`, `setChemB(null)`, etc.

## Quick Wins (< 1 day each)
1. Implement CSV Export in `history.jsx`.
2. Add first-visit `localStorage` tooltips to `Lab3D.jsx`.
3. Add a "Clear Selection" button in `Lab3D.jsx`.
