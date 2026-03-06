# Market Research Report
**App:** Alchemistry is a 3D web-based virtual chemistry laboratory built with React and Three.js, allowing students to conduct interactive chemistry experiments (organic, inorganic, titration) in a safe digital environment.
**Market:** EdTech / Virtual Science Education / STEM Lab Simulation Software
**Date:** 2024-05-24
**Competitors Researched:** PraxiLabs, Labster, Beyond Labz, ChemCollective

## Executive Summary
The virtual chemistry lab market is highly focused on combining realistic 3D simulations with structured pedagogy, safety training, and guided learning. While Alchemistry has strong foundational 3D interactions and functional modules (Lab, Titration, Organic, Inorganic), it lacks the structured educational scaffolding, real-time data visualization, and gamified safety protocols that market leaders like PraxiLabs and Labster provide. By integrating these contextual learning tools and safety checks, Alchemistry can significantly elevate its value proposition for educational institutions.

## Competitor Analysis
* **PraxiLabs:** Focuses heavily on realistic 3D interaction, anytime access, personalized "game-like" learning, instant guidance/feedback (AI Assistant "Oxi"), and comprehensive LMS integration. Known for its strong curriculum alignment.
* **Labster:** The market leader in immersive 3D/VR science simulations. Key differentiators include gamified learning paths, strong storytelling, and embedded quizzes/assessments within the 3D environment.
* **Beyond Labz:** Focuses on open-ended "sandbox" environments where students can make mistakes and learn from them. Highly praised for its adaptability to existing curricula and focus on classic, curriculum-aligned experiments.
* **ChemCollective:** (Older but widely used) Focuses strongly on the theoretical calculations and virtual lab problem-solving, particularly around stoichiometry and equilibrium, rather than just visual spectacle.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
1. **Virtual Safety/PPE Protocols:** Competitors require students to "equip" safety gear (goggles, gloves) before starting experiments to reinforce real-world lab habits.
2. **Guided Onboarding/Tutorials:** First-time users in tools like Labster receive step-by-step guidance on how to interact with the lab equipment.
3. **Contextual Theoretical Information:** Explanations of *why* a reaction is happening, not just that it happened.
4. **Real-time Data Visualization:** Graphing data as it is collected (e.g., titration curves).

### Differentiating Opportunities (Stand-out features)
1. **Gamified Mistake Handling:** Allowing students to mix incompatible chemicals safely but providing educational feedback on *why* it was a mistake (e.g., "Boom! You just mixed a strong acid and base too quickly...").
2. **In-Experiment Quizzes:** Small knowledge checks during the process to ensure understanding, not just clicking through.

### UX Patterns (Design/interaction patterns common in top products)
1. **"Lab Manual" Sidebar:** A persistent, accessible panel containing the experiment instructions, theoretical background, and safety notes.
2. **Interactive Equipment Tooltips:** Hovering over or clicking equipment provides its name, function, and current state.

## Prioritised Recommendations

### 1. Pre-Lab Safety Check (PPE Check) — Priority: HIGH | Effort: SMALL
**What:** A mandatory modal or checklist before entering the `/lab` or other experiment modules where users must acknowledge or "equip" virtual safety gear (goggles, lab coat, gloves).
**Why:** Standard practice in all educational lab simulations (Labster, PraxiLabs) to reinforce real-world safety habits. Highly requested by educators.
**Where in code:** `client/src/pages/lab.jsx` (and other experiment pages). Create a new `SafetyCheckModal` component.
**How:** Implement a simple state `hasPassedSafetyCheck` initialized to `false`. If `false`, display a modal requiring the user to click checkboxes for "Goggles", "Lab Coat", and "Gloves" before rendering the main lab UI.

### 2. Guided Onboarding Tour — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step guided tour for first-time users explaining the UI elements (Chemical Rack, Center Stage, Status Panel).
**Why:** Top tools use contextual tooltips to reduce cognitive load and teach the interface. Alchemistry currently drops users directly into the interface.
**Where in code:** `client/src/pages/lab.jsx` and a new `client/src/components/OnboardingTour.jsx`.
**How:** Use a library like `intro.js-react` or build a custom overlay. Check `localStorage.getItem('hasSeenTour')`. If null, start the tour highlighting the chemical sliders, the reaction button, and the status panel.

### 3. Real-Time Titration Curve Graph — Priority: HIGH | Effort: MEDIUM
**What:** Display a dynamic graph plotting pH vs. Volume of titrant added during the titration experiment.
**Why:** Tools like Beyond Labz and ChemCollective emphasize data analysis. Alchemistry's titration currently focuses on visual color change but misses the core quantitative aspect of titration (the curve).
**Where in code:** `client/src/pages/titration.jsx` (and potentially `client/src/data/all_data.js` to feed the graph).
**How:** Integrate a charting library (like `recharts` or `chart.js`). Update the graph state in real-time as the user clicks to add titrant drops, mapping the current volume to the expected pH value.

### 4. Interactive "Lab Manual" Sidebar — Priority: MEDIUM | Effort: SMALL
**What:** A slide-out or persistent sidebar containing the experiment objectives, theoretical background, and chemical properties.
**Why:** Replaces the current minimal "Status" panel with actionable educational content, a standard UX pattern in PraxiLabs and Labster.
**Where in code:** Modify the Right Panel in `client/src/pages/lab.jsx`.
**How:** Expand the existing `status-panel` div into a tabbed interface (e.g., "Status", "Manual", "Theory"). Add static content explaining the expected reactions for the available chemicals (HCl, NaCl, CuSO4, FeSO4).

### 5. Dynamic Reaction Tooltips (The "Why") — Priority: MEDIUM | Effort: SMALL
**What:** When a reaction occurs (e.g., after clicking "INITIATE REACTION"), display a tooltip or notification explaining the chemical equation and why the color changed.
**Why:** Moves the app from just a visual simulation to an educational tool. Students need to connect the visual result with the chemical theory.
**Where in code:** `client/src/pages/result.jsx` or `client/src/pages/lab.jsx`.
**How:** When `navigate("/result", ...)` is called, pass the expected chemical equation as state, or map the `chemA, chemB...` combinations in `result.jsx` to a dictionary of explanations and display them alongside the visual result.

### 6. Interactive Equipment Hover States — Priority: LOW | Effort: SMALL
**What:** Tooltips appearing when hovering over 3D objects or 2D chemical icons explaining their real-world usage and current state (e.g., "1M HCl - Strong Acid").
**Why:** Enhances exploratory learning, common in Beyond Labz.
**Where in code:** `client/src/pages/lab.jsx` (Chemical Rack icons) and 3D components (`client/src/components/3d-animations/`).
**How:** Add `title` attributes or custom hover tooltip components to the `chem-icon-wrapper` elements.

### 7. Experiment Reset / Retry Functionality — Priority: LOW | Effort: SMALL
**What:** A clear "Reset Experiment" button to quickly clear all inputs and visual states without navigating away.
**Why:** Encourages iterative learning and trial-and-error, a key philosophy in Beyond Labz.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/result.jsx`.
**How:** Add a "Reset" button that simply sets `chemA, chemB, chemC, chemD` back to 0 and resets the `animate` and `tcolor` states.

### 8. Gamified "Mistake" Feedback — Priority: MEDIUM | Effort: MEDIUM
**What:** Instead of just a generic result, if an invalid or dangerous combination is mixed, provide specific, safe "virtual explosion" or error feedback with an educational explanation.
**Why:** High engagement feature found in Labster; teaches safety through safe failure.
**Where in code:** `client/src/pages/lab.jsx` (reaction logic) and `client/src/pages/result.jsx`.
**How:** Add a check in `onOrNot()` or the result calculation for incompatible chemical combinations. If found, trigger a specific animation and error message explaining the chemical incompatibility.

### 9. Persistent User Progress/Badges — Priority: LOW | Effort: LARGE
**What:** Track which experiments a user has successfully completed and award badges (e.g., "Titration Master").
**Why:** Gamification significantly increases retention in ed-tech (e.g., PraxiLabs).
**Where in code:** `client/src/pages/Dashboard.jsx` and Supabase backend.
**How:** Create a new Supabase table `user_achievements`. Fetch and display these badges on the Dashboard.

### 10. Built-in Knowledge Checks (Quizzes) — Priority: MEDIUM | Effort: LARGE
**What:** Short, 2-3 question quizzes that must be passed before or after an experiment to verify understanding.
**Why:** Requested by educators to ensure students aren't just clicking through the simulation. Standard in PraxiLabs and Labster.
**Where in code:** New route/component (e.g., `client/src/pages/Quiz.jsx`) integrated into the experiment flow.
**How:** Create a JSON structure of questions mapped to experiments. Display a modal quiz either before entering the lab or after viewing the result, saving scores to the backend.

## Quick Wins (< 1 day each)
1. **Pre-Lab Safety Check (PPE Check):** Simple modal state before rendering the lab UI. High impact for educational credibility.
2. **Interactive "Lab Manual" Sidebar:** Expand the existing status panel with static educational content (chemical equations, theory) for the specific lab being run.
3. **Experiment Reset / Retry Functionality:** A simple state-clearing button to encourage rapid trial-and-error.
