# Market Research Report
**App:** Alchemistry - A 3D virtual chemistry laboratory for conducting safe, interactive experiments.
**Market:** EdTech / Virtual Science Labs (Higher Ed & K-12)
**Date:** 2026-02-24
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The market for virtual labs is dominated by "Safety First" and "Learning Management" features. While Alchemistry offers impressive 3D visuals and specific modules (Titration, Organic), it critically lacks the **data integrity** expected of an educational tool—specifically, general experiment results are not saved to the user's permanent history. Additionally, the complete absence of **safety protocols** (even virtual ones like checking PPE) diminishes its realism compared to competitors like PraxiLabs. Addressing these two areas will significantly elevate the app from a "simulation toy" to a credible "educational platform."

## Competitor Analysis

| Competitor | Key Strengths | Weaknesses | Relevance to Alchemistry |
| :--- | :--- | :--- | :--- |
| **Labster** | High-fidelity 3D, gamified storytelling, massive content library. | Expensive, heavy load times. | Direct competitor for "immersive 3D" experience. Alchemistry is lighter/faster but less guided. |
| **PraxiLabs** | "Safety First" focus, strong accessibility, bilingual, affordable. | UI can be clunky, less "game-like". | **Major inspiration for Safety & Accessibility.** Their emphasis on procedure is a key differentiator we can adopt. |
| **PhET** | Free, accessible, simple concept focus (2D/3D). | Not a full "lab" environment, isolated concepts. | Shows the value of **simple, direct feedback**. Alchemistry adds the "lab context" that PhET lacks. |

## Gap Analysis

### 🚨 Critical Gaps (Must Fix)
1.  **Broken History Tracking:** The `Result.jsx` page saves data to `localStorage` (unreliable, device-specific) but **does not write to the Supabase database**. Only the Titration module works correctly. This means students lose their work if they switch devices or clear cache.
2.  **Safety Protocols:** Competitors mandate a "PPE Check" (Put on Goggles/Coat) before entering the lab. Alchemistry allows immediate chemical handling, which encourages bad habits.

### ⚠️ Educational Gaps (Table Stakes)
1.  **Guided Onboarding:** New users are dropped into the `Lab` or `Titration` page with zero instruction. Competitors use "Lab Manuals" or guided tours (Wizard style) to explain the equipment.
2.  **Data Export:** The `History` page is read-only. Competitors allow exporting results to PDF/CSV for homework submission.

### 🎨 UX Patterns
1.  **Accessible Controls:** Competitors ensure all sliders and chemical interactions are keyboard/screen-reader accessible. Alchemistry's custom sliders and 3D interactions lack ARIA labels.

## Prioritised Recommendations

### 1. Unify Experiment Tracking — Priority: HIGH | Effort: MEDIUM
**What:** Modify `client/src/pages/result.jsx` to insert the experiment result into Supabase's `experiment_results` table, mirroring the logic in `Titration.jsx`.
**Why:** **Critical Bug/Feature.** Currently, students cannot prove they completed a general chemistry experiment. This is essential for any educational use case.
**Where in code:** `client/src/pages/result.jsx` (Result component), `client/src/pages/titration.jsx` (reference for `saveResult`).
**How:**
1.  Import `supabase` client in `result.jsx`.
2.  In the `useEffect` that processes the result, add a `supabase.from('experiment_results').insert(...)` call.
3.  Ensure it handles the `user_id` correctly.

### 2. Safety Check Protocol — Priority: HIGH | Effort: SMALL
**What:** Add a "Safety Check" modal before allowing access to `Lab` or `Titration` pages.
**Why:** **Market Differentiator.** Adds realism and educational value ("Safety First"). Brings the app in line with PraxiLabs' standards.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/titration.jsx`.
**How:**
1.  Create a `SafetyModal` component (Checkboxes: "Goggles", "Lab Coat", "Gloves").
2.  Use a state variable `isSafetyChecked` in the pages.
3.  Block interaction with the lab until the modal is completed.

### 3. Interactive Lab Manual — Priority: MEDIUM | Effort: MEDIUM
**What:** Add a "Lab Manual" button that opens a side panel or modal with step-by-step instructions for the current experiment.
**Why:** **Onboarding.** Users currently guess how to use the app. A guide reduces frustration and mimics real lab protocols.
**Where in code:** `client/src/pages/lab.jsx`.
**How:**
1.  Add a "MANUAL" button to the UI (e.g., top right).
2.  Create a `LabManual` component with simple text steps (1. Select Acid, 2. Add Base...).

### 4. Data Export (CSV) — Priority: MEDIUM | Effort: SMALL
**What:** Add an "Export CSV" button to the `History` page.
**Why:** **Utility.** Allows students to submit their work to LMS or teachers. Standard feature in all competitors.
**Where in code:** `client/src/pages/history.jsx`.
**How:**
1.  Add a function `downloadCSV` that converts the `experiments` state to CSV format.
2.  Trigger a browser download of `experiment_history.csv`.

### 5. Accessibility Boost — Priority: MEDIUM | Effort: MEDIUM
**What:** Add `aria-label`, `role="slider"`, and keyboard support to the chemical sliders and control buttons.
**Why:** **Compliance.** Educational tools must be accessible. Currently, the custom inputs are hard to use without a mouse.
**Where in code:** `client/src/pages/lab.jsx`, `client/src/components/testtube.jsx`.
**How:**
1.  Add `aria-label="Concentration of HCl"` to inputs.
2.  Ensure `tabIndex` is managed for custom buttons.

## Quick Wins (< 1 day each)
1.  **Data Export:** Adding a CSV download button to `History.jsx` is a <1 hour task with high value.
2.  **Safety Modal:** A simple "Agree to Safety" modal is quick to build and immediately changes the "vibe" of the app to be more professional.
3.  **Fix Tracking:** Fixing the Supabase insert in `Result.jsx` is just copying logic from `Titration.jsx` and adapting the payload.
