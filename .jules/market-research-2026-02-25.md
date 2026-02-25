# Market Research Report
**App:** Alchemistry - A virtual chemistry laboratory for students.
**Market:** Virtual Science Labs / EdTech
**Date:** 2026-02-25
**Competitors Researched:** Labster, PhET Interactive Simulations, PraxiLabs

## Executive Summary
Alchemistry is a promising MVP that delivers visually engaging 3D chemistry simulations using a modern tech stack (React, Three.js). However, it currently fails to deliver on the core educational promise of "tracking progress" due to a critical disconnect between the simulation results and the database. While competitors like Labster and PhET offer robust progress tracking and safety education, Alchemistry currently lacks these "table stakes" features. Addressing the broken data persistence and adding a basic safety protocol will immediately elevate the app from a visual demo to a functional educational tool.

## Competitor Analysis

### 1. Labster (High-End / Commercial)
**Strengths:**
- **Immersive Storytelling:** Uses "CSI-style" missions to engage students.
- **Safety Training:** Mandatory virtual safety checks (gloves, goggles) before experiments.
- **Teacher Dashboard:** Detailed analytics on student performance.
**Weaknesses:** Expensive, heavy load times, requires high-end hardware.

### 2. PhET Interactive Simulations (Free / Academic)
**Strengths:**
- **Accessibility:** Highly accessible (keyboard nav, screen reader support).
- **Simplicity:** Focuses on the core concept without distractions.
- **No Login Required:** Easy for quick classroom use.
**Weaknesses:** 2D only (less immersive), basic tracking.

### 3. PraxiLabs (3D / Broad Scope)
**Strengths:**
- **Broad Curriculum:** Covers Biology, Chemistry, and Physics.
- **Help/Theory:** Always available "Theory" tab for context.
- **Export:** Students can download lab reports as PDFs.
**Weaknesses:** UI can be cluttered, subscription-based.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
- **Data Persistence:** Users expect their experiment history to be saved across sessions. Currently, `Result.jsx` saves to `localStorage` but `History.jsx` reads from the database, meaning history is effectively broken for the user.
- **Safety Protocols:** In a chemistry lab app, "Safety First" is a mandatory lesson. Competitors force users to "gear up" virtually. Alchemistry has no such check.
- **Exportable Reports:** Students need to submit evidence of their work. Competitors offer PDF/CSV export. Alchemistry has none.

### Differentiating Opportunities
- **Modern UI:** Alchemistry's "Glassmorphism" UI is cleaner and more modern than PhET or PraxiLabs.
- **Quick-Start:** Unlike Labster, Alchemistry loads fast.

### UX Patterns
- **Contextual Theory:** Competitors provide a "Theory" or "Help" sidebar explaining the reaction. Alchemistry only gives the product name and properties *after* the fact.
- **Onboarding:** Competitors use guided tours (e.g., "Click here to add acid"). Alchemistry relies on user intuition.

## Prioritised Recommendations

### 1. Fix Data Persistence — Priority: CRITICAL | Effort: SMALL
**What:** Implement a function to save experiment results to Supabase in `Result.jsx`.
**Why:** The `History` page is currently broken because it reads from a table (`experiment_results`) that is never written to by the `Result` page. This is a critical bug that prevents the app from fulfilling its core purpose of tracking experiments.
**Where in code:** `client/src/pages/result.jsx`
**How:**
1.  Import `supabase` client.
2.  In the `useEffect` that processes the result, add a call to `supabase.from('experiment_results').insert({...})`.
3.  Ensure it handles the user's session ID correctly.

### 2. Add Safety Protocol Modal — Priority: HIGH | Effort: MEDIUM
**What:** A modal that appears before entering the `Lab` page, requiring the user to click "Put on Goggles" and "Wear Lab Coat."
**Why:** Teaches real-world safety habits and adds immersion. Standard feature in Labster and PraxiLabs.
**Where in code:** `client/src/pages/lab.jsx` (or a wrapper component).
**How:**
1.  Create a `SafetyModal` component.
2.  Use a state variable `hasPPE` in `Lab.jsx`.
3.  Show modal if `!hasPPE`.
4.  Prevent interaction with the lab until PPE is equipped.

### 3. Export Lab Report — Priority: MEDIUM | Effort: SMALL
**What:** Add a "Download Report" button to the `History` page.
**Why:** Students need to submit proof of their work to teachers.
**Where in code:** `client/src/pages/history.jsx`
**How:**
1.  Add a button "Export to CSV".
2.  On click, convert the `experiments` array to CSV format.
3.  Trigger a browser download of `experiment_history.csv`.

### 4. Contextual Theory Panel — Priority: MEDIUM | Effort: MEDIUM
**What:** A collapsible sidebar in the Lab view that explains the chemicals currently selected.
**Why:** Provides educational context *during* the experiment, not just after.
**Where in code:** `client/src/pages/lab.jsx`
**How:**
1.  Create a `TheoryPanel` component.
2.  Pass the currently selected chemicals (`chemA`, `chemB`...) to it.
3.  Display static info about these chemicals (e.g., "HCl is a strong acid...").

### 5. Onboarding Tour — Priority: LOW | Effort: MEDIUM
**What:** A simple "Intro.js" style tour for first-time users.
**Why:** Helps new users understand the UI (Chemical Rack, Test Tube, Initiate Button).
**Where in code:** `client/src/pages/lab.jsx`
**How:**
1.  Use a library like `react-joyride` or simple state-based tooltips.
2.  Highlight the "Chemical Rack" first, then the "Test Tube", then "Initiate".

## Quick Wins (< 1 day each)
1.  **Fix Data Persistence:** 1-2 hours to hook up Supabase insert.
2.  **Export CSV:** 1 hour to implement a simple JS-to-CSV download.
3.  **Safety Modal:** 2-3 hours to build a simple modal with 2 buttons.
