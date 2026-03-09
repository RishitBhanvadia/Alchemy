# Market Research Report
**App:** Alchemistry is a 3D web-based virtual chemistry laboratory using React and Three.js that enables students to conduct safe, interactive experiments and track their results.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-03-09
**Competitors Researched:** Labster, PraxiLabs, Beyond Labz, ChemCollective

## Executive Summary
The virtual chemistry lab market is transitioning from simple 2D interactive simulations to immersive, gamified 3D experiences that closely mimic real-world environments. Alchemistry is well-positioned with its 3D environment (Three.js) and modern glassmorphism UI. However, top competitors differentiate themselves by providing structured learning paths, deeper theoretical context before experiments, gamified elements (scores, achievements), and safety protocol simulations. The biggest opportunity for Alchemistry is to add structured pedagogical features around its existing sandbox environment to make it a more complete learning tool rather than just a simulation engine.

## Competitor Analysis
* **Labster:** The market leader. Known for highly gamified, story-driven 3D simulations. Focuses heavily on guiding students through a narrative (e.g., "solve a crime using chemistry"). Strong LMS integration.
* **PraxiLabs:** Focuses on realistic, step-by-step procedures. Strong emphasis on safety protocols (PPE selection) before starting experiments. Detailed post-experiment analysis and quizzes.
* **Beyond Labz:** Offers an open-ended "sandbox" style similar to Alchemistry's current state, but includes a comprehensive lab manual and worksheet system to guide students.
* **ChemCollective:** Older, 2D interface but highly regarded for its pedagogical value. Focuses on calculations, stoichiometry, and providing real-world context for the reactions.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Lab Manual/Instructions:** Competitors provide step-by-step guides or theoretical background before the experiment starts. Alchemistry drops users directly into the lab.
* **Data Export:** The ability to download experiment results (PDF/CSV) for assignments is standard in top platforms.

### Differentiating Opportunities (Stand-out features)
* **Pre-Lab Safety Protocols:** PraxiLabs requires users to "put on" virtual goggles and gloves. This adds realism and reinforces good lab habits.
* **Gamification (Achievements/Badges):** While Alchemistry tracks scores in history, it lacks real-time feedback or unlockable achievements to keep students engaged.

### UX Patterns (Design/interaction patterns common in top products)
* **Contextual Tooltips:** Top platforms use tooltips to explain *why* a reaction is happening or what a specific piece of equipment does.
* **Reset/Undo Actions:** Allowing students to quickly clear the workspace if they make a mistake without navigating away.

## Prioritised Recommendations

### 1. Pre-Lab Briefing Modal — Priority: HIGH | Effort: SMALL
**What:** A modal that appears when entering the `/lab` route, explaining the objective and safety notes before allowing interaction.
**Why:** Competitors like PraxiLabs and Beyond Labz anchor the simulation with theory. Currently, users are dropped in without context.
**Where in code:** `client/src/pages/lab.jsx` (Add a state for `showBriefing` and a modal overlay component).
**How:** Create a `BriefingModal` component. Render it conditionally in `lab.jsx`. User must click "Acknowledge & Begin" to dismiss.

### 2. Export Results to PDF/CSV — Priority: HIGH | Effort: MEDIUM
**What:** A button on the result page to download the experiment data.
**Why:** Table stakes for EdTech. Students need to submit evidence of their work.
**Where in code:** `client/src/pages/result.jsx`
**How:** Add an "Export Report" button. Use the existing `data` state (which contains product details, input percentages) to generate a simple CSV or use a lightweight library like `jspdf` for a formatted report.

### 3. "Clear Lab" Quick Action — Priority: MEDIUM | Effort: SMALL
**What:** A button in the lab interface to instantly reset all chemical concentrations to 0%.
**Why:** Common UX pattern in sandbox labs (Beyond Labz) to encourage experimentation without reloading the page.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a "Reset Equipment" button that calls `setChemA(0)`, `setChemB(0)`, etc.

### 4. Interactive Tooltips for Chemicals — Priority: MEDIUM | Effort: SMALL
**What:** Hover tooltips on the chemical icons (HCl, NaCl, etc.) that show a brief description or hazard warning.
**Why:** Enhances the educational value. Competitors use this to teach nomenclature and properties before the reaction.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add standard HTML `title` attributes to the `.chem-icon-wrapper` divs, or use a lightweight tooltip library.

### 5. Structured "Lab Manual" Sidebar — Priority: LOW | Effort: MEDIUM
**What:** A collapsible sidebar in the lab view containing step-by-step instructions.
**Why:** Moves the app from a pure sandbox to a guided learning tool, a key differentiator for Labster.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a new toggleable panel alongside the `chemical-rack` containing text instructions.

### 6. Personal Best / Streak Tracker — Priority: LOW | Effort: MEDIUM
**What:** Display the user's highest score or experiment streak on the Dashboard.
**Why:** Gamification increases engagement.
**Where in code:** `client/src/pages/Dashboard.jsx` and `client/src/pages/history.jsx`
**How:** Fetch the highest score from the existing `experiment_results` table in Supabase and display it on the Dashboard.

### 7. Virtual PPE Requirement — Priority: LOW | Effort: MEDIUM
**What:** A small checklist (Goggles, Gloves, Coat) that must be clicked before the "INITIATE REACTION" button is enabled.
**Why:** Highly praised feature in PraxiLabs that reinforces real-world safety.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add state variables for PPE toggles. Update the `isPlayDisabled` logic to require PPE states to be true.

### 8. Reaction Speed Control — Priority: LOW | Effort: SMALL
**What:** A toggle or slider to speed up or slow down the 1500ms animation delay.
**Why:** Useful for complex reactions where students want to observe intermediate steps (common in ChemCollective).
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a speed state and use it to adjust the `setTimeout` duration in `useHandlePlayClick`.

### 9. Theory Quiz on Result Page — Priority: LOW | Effort: LARGE
**What:** A quick 1-2 question quiz about the reaction that just occurred.
**Why:** Deepens the pedagogical value and provides the "Score" that is currently stored in history.
**Where in code:** `client/src/pages/result.jsx`
**How:** Add a Quiz component below the product data. Would require a new data structure or API endpoint to fetch questions based on the reactants.

### 10. Direct "Retry" from History — Priority: LOW | Effort: SMALL
**What:** A button on the History table rows to jump straight back into the lab with those specific concentrations pre-filled.
**Why:** Allows students to easily retry failed experiments or tweak previous setups.
**Where in code:** `client/src/pages/history.jsx`
**How:** Pass the historical concentrations via React Router `state` when navigating from History to the Lab page.

## Quick Wins (< 1 day each)
1. Pre-Lab Briefing Modal (Contextualizes the sandbox)
2. "Clear Lab" Quick Action (Improves UX)
3. Interactive Tooltips for Chemicals (Adds instant educational value)
