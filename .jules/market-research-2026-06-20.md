# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory offering safe, interactive 3D simulations (organic, inorganic, titration) with AI tutoring and teacher analytics.
**Market:** EdTech / Virtual Science Laboratories for Higher Ed & High Schools
**Date:** 2026-06-20
**Competitors Researched:** Labster, Beyond Labz, PraxiLabs

## Executive Summary
The virtual chemistry lab market is highly competitive, dominated by platforms prioritizing pedagogy alongside simulation. While Alchemistry excels in UI/UX (Glassmorphism) and sandbox freedom with an AI tutor, it lacks the structured guidance and assessment tools found in top competitors. The greatest opportunity lies in adding "guardrails"—such as hazard warnings, unknown identification tasks, and in-experiment quizzes—to bridge the gap between freeform experimentation and curriculum-aligned learning, utilizing existing 3D assets and data models.

## Competitor Analysis
- **Labster:** Leader in gamified, scenario-based learning (e.g., "Escape the Lab"). Heavy focus on narrative and step-by-step guidance. Differentiator: immersive storytelling linked to real-world applications.
- **Beyond Labz:** Strongest in sheer volume of possibilities (1M+ outcomes) and qualitative analysis. Differentiator: robust analytical tools (NMR, FTIR, MS) and a vast library of "unknown" compounds for students to identify.
- **PraxiLabs:** Focuses on accessibility, low cost, and AI assistance ("Oxi"). Differentiator: strong LMS integration, custom quiz builder, and explicit safety/hazard warnings in the virtual environment.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Step-by-step guided lab manuals (currently fully sandbox).
- Safety and hazard warnings for specific chemical combinations (e.g., exothermic reactions).
- Built-in assessments/quizzes tied to specific experiment milestones.

### Differentiating Opportunities (Stand-out features)
- Qualitative analysis of "unknowns" (giving students a mystery chemical to identify).
- Scenario-based learning (giving the reaction a real-world purpose).
- Spectroscopy/Analytical tools (e.g., simulated TLC plates or simple spectra).

### UX Patterns (Design/interaction patterns common in top products)
- Interactive, multi-step progress bars indicating experiment completion.
- Contextual tooltips for lab equipment and chemical properties before mixing.

## Prioritised Recommendations

### 1. Hazard and Safety Warnings — Priority: HIGH | Effort: SMALL
**What:** Display contextual warnings when students select potentially dangerous chemical combinations (e.g., strong acids/bases) before initiating the reaction.
**Why:** Safety is a primary selling point for virtual labs. PraxiLabs emphasizes this explicitly.
**Where in code:** `client/src/pages/Lab3D.jsx` (before `handlePlayClick`) and `client/src/store/labStore.js`
**How:** Add a `hazardMap` to `labStore`. When chemicals are selected, check the map and display a toast or warning banner in `Lab3D.jsx` before allowing the reaction to proceed.

### 2. "Identify the Unknown" Mode — Priority: HIGH | Effort: MEDIUM
**What:** Introduce "Unknowns" in the chemical selection, challenging students to deduce the chemical based on reaction results (color changes, precipitates).
**Why:** A core feature of Beyond Labz that deepens analytical thinking compared to just following a recipe.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`
**How:** Add an `isUnknown` flag to chemical data. Mask the name in the UI. Upon reaction in `ResultModal.jsx`, offer a multiple-choice dropdown to guess the unknown based on the visual result.

### 3. Pre-Reaction Hypothesis Quiz — Priority: MEDIUM | Effort: SMALL
**What:** Ask students to predict the outcome (e.g., color change, gas evolution) before the reaction runs.
**Why:** Shifts the app from a passive sandbox to active learning, matching Labster's embedded assessments.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/ResultModal.jsx`
**How:** Intercept the "INITIATE REACTION" button click with a simple modal asking "What do you expect to happen?". Store the answer and compare it in `ResultModal.jsx` after the animation.

### 4. Step-by-Step Lab Manual overlay — Priority: MEDIUM | Effort: MEDIUM
**What:** A collapsible sidebar/panel containing the procedure for a specific assigned experiment.
**Why:** Teachers need structured assignments, not just free play.
**Where in code:** `client/src/pages/Lab3D.jsx` and new component `client/src/components/LabManual.jsx`
**How:** Fetch assignment details from Supabase. Display steps with checkboxes. Tie checkboxes to `labStore` state to automatically check off steps (e.g., "Select HCl" -> checked).

### 5. Export Lab Report to PDF — Priority: LOW | Effort: SMALL
**What:** Allow students to export their reaction results and history as a formatted PDF.
**Why:** Standard requirement for submitting assignments in LMS ecosystems.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/result.jsx`
**How:** Add a "Download Report" button using a library like `html2pdf.js` or `jspdf` to capture the DOM of the result modal or history logs.

## Quick Wins (< 1 day each)
1. **Hazard and Safety Warnings:** Simple state check and toast notification.
2. **Pre-Reaction Hypothesis Quiz:** Basic modal interception before triggering the 3D animation.
3. **Export Lab Report:** Quick client-side PDF generation from existing data.
