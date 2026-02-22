# Market Research Report

**App:** Virtual Chemistry Laboratory simulating chemical reactions (Organic, Inorganic, Titration) with 3D visualization.
**Market:** EdTech / Virtual Science Labs (Higher Ed & K-12)
**Date:** 2025-02-18
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
Alchemistry enters the growing virtual lab market with a strong visual foundation (Three.js) but lacks the pedagogical scaffolding found in market leaders. While competitors like Labster and PraxiLabs offer guided, narrative-driven experiences with integrated assessment, Alchemistry functions more as an open sandbox. The critical opportunity is to bridge this gap by adding "Guided Inquiry" features—interactive tutorials, safety contexts, and formative assessments—transforming it from a simulator into a complete learning platform. Additionally, a major data persistence gap exists where general lab experiments are not saved to the backend, unlike titration experiments.

## Competitor Analysis

| Competitor | Key Strengths | Differentiators | Weaknesses |
| :--- | :--- | :--- | :--- |
| **Labster** | High-fidelity 3D, Story-based learning, LMS integration | "CSI-style" narratives, Virtual lab assistant | Expensive, heavy resource usage |
| **PraxiLabs** | Wide range of experiments, "Oxi" AI assistant, Multilingual | Focus on "Practice-Centric" repetition, hints/manuals | UI less polished than Labster |
| **PhET** | Free, accessible, simple 2D models | Massive user base, very low barrier to entry | Limited 3D realism, less immersive |

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
1.  **Unified Progress Tracking:** Currently, `Titration.jsx` saves to Supabase, but `Lab.jsx` (the main experiment runner) only saves to `localStorage`. Students lose data if they clear cache or change devices.
2.  **Onboarding / Instructions:** Competitors provide step-by-step guides or overlays (e.g., "Click here to add acid"). Alchemistry drops users directly into the lab with no guidance.
3.  **Lab Safety Context:** A virtual lab should teach safety. Competitors flag hazardous chemicals. Alchemistry only notes "Solutions are 1 M".

### Differentiating Opportunities (Stand-out features)
1.  **"Guided Inquiry" Mode:** toggle between "Sandbox" (current) and "Guided" (step-by-step with quizzes).
2.  **AI Lab Partner:** A simple chat interface (like PraxiLabs' "Oxi") to ask "What happens if I mix HCl and Na?", utilizing the existing `chemicals` logic.

### UX Patterns
*   **Progress Bars:** Visible in `Titration`, but `Lab` lacks a clear "Experiment Progress" indicator until the result.
*   **Tooltips:** Hovering over chemicals should show properties (Molar mass, hazards).

## Prioritised Recommendations

### 1. Unified Data Persistence — Priority: CRITICAL | Effort: MEDIUM
**What:** Ensure `Lab.jsx` / `Result.jsx` writes experiment results to the Supabase `experiment_results` table, mirroring the implementation in `Titration.jsx`.
**Why:** Currently, the "History" page is incomplete because it only pulls from Supabase, missing all general lab experiments. This breaks the user's learning record.
**Where in code:** `client/src/pages/result.jsx`
**How:**
1.  Import `supabase` client in `Result.jsx`.
2.  In the `useEffect` where `data` is received, add a `supabase.from('experiment_results').insert(...)` call.
3.  Use the existing `user_id` from `supabase.auth.getUser()`.

### 2. Guided Inquiry (Onboarding) — Priority: HIGH | Effort: MEDIUM
**What:** Add an interactive tour for first-time users.
**Why:** Users (especially students) need scaffolding to understand the interface and learning objectives.
**Where in code:** `client/src/pages/lab.jsx`
**How:**
1.  Install `react-joyride`.
2.  Define `steps` (e.g., "Select Acid", "Adjust Concentration", "Initiate Reaction").
3.  Store `hasSeenTutorial` in `localStorage` to show only once.

### 3. Post-Lab Quiz — Priority: HIGH | Effort: MEDIUM
**What:** Add a "Knowledge Check" before showing the full result or as a tab in the result page.
**Why:** Transforms the app from a "toy" to an "educational tool". Competitors utilize this to validate learning.
**Where in code:** `client/src/pages/result.jsx`
**How:**
1.  Create a `QuizComponent` that takes the reaction product as a prop.
2.  Generate a simple question (e.g., "What type of reaction is this?").
3.  Gate the full `Result` view behind the quiz or award bonus "XP/Score".

### 4. Safety Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show hazard information when hovering over chemical bottles.
**Why:** essential for chemistry education standards.
**Where in code:** `client/src/pages/lab.jsx`
**How:**
1.  Enhance the `CHEMICALS` data structure (or hardcoded lists) to include `hazard: "Corrosive"` or `nfpa: { health: 3, flammability: 0 ... }`.
2.  Add a simple Tooltip component wrapping the chemical images.

### 5. Lab Report Export — Priority: LOW | Effort: MEDIUM
**What:** Allow users to download a PDF of their experiment.
**Why:** Students need to submit evidence of work.
**Where in code:** `client/src/pages/result.jsx`
**How:**
1.  Use `jspdf` or `react-pdf`.
2.  Button "Download Report" generates a PDF with the Reaction Equation, Observation, and Date.

## Quick Wins (< 1 day each)
1.  **Safety Tooltips:** simple text title attributes or a custom tooltip on chemical images in `Lab.jsx`.
2.  **Result "Retry" Loop:** enhance the "New Experiment" button in `Result.jsx` to optionally keep the same chemicals but reset amounts for rapid iteration.
3.  **Dashboard "Last Experiment" Widget:** Show the most recent result on `Dashboard.jsx` (currently only shows aggregate stats or links).
