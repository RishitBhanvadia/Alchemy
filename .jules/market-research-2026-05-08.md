# Market Research Report
**App:** A web-based 3D virtual chemistry laboratory enabling students to conduct safe, interactive experiments with real-time feedback and teacher monitoring.
**Market:** EdTech / Virtual Science Laboratories
**Date:** 2026-05-08
**Competitors Researched:** Labster, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market focuses heavily on safe, interactive, and visually engaging learning environments. Top competitors excel by offering structured learning paths, accessibility features (inclusive design, voicing), and practice-based simulations (e.g. escaping labs, balancing equations). Alchemistry's 3D environment is a strong foundation, but it lacks the structured practice activities, gamified problem-solving, and deep accessibility features common in leading platforms.

## Competitor Analysis
*   **Labster:** Premium, 3D labs. Strengths: Gamified narratives (Escape Rooms!), practice activities, specific modules like balancing equations. Focuses heavily on applying knowledge to survive/succeed.
*   **PhET Interactive Simulations:** Free, widely used. Strengths: Highly accessible (Voicing, keyboard navigation, alternative input), simple UI, immediate visual feedback for concepts like states of matter and reaction rates.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Accessibility Features (Inclusive Design):** Keyboard navigation specifically tailored for moving items, voicing of actions/results. Alchemistry has basic screen reader text but lacks comprehensive interactive description.
*   **Targeted Practice Activities:** Specific challenges (like balancing a specific equation) rather than just an open sandbox.

### Differentiating Opportunities (Stand-out features)
*   **Gamified Problem Solving / Scenarios:** "Escape the Lab" style scenarios where students must apply physical/chemical property knowledge.
*   **Variable Manipulation for Concepts:** Directly manipulating temperature/concentration to see effects on reaction rates (PhET style), not just mixing chemicals.

### UX Patterns (Design/interaction patterns common in top products)
*   **Alternative Input Methods:** Allowing WASD or arrow keys for grabbing and moving items (PhET).
*   **Visualizing the Invisible:** Showing atoms colliding to explain reaction rates.

## Prioritised Recommendations

### 1. "Escape the Lab" Gamified Scenario — Priority: HIGH | Effort: LARGE
**What:** Add a specific gamified mode where students must identify properties to "unlock" the next step.
**Why:** Labster uses this to great effect. It transforms a sandbox into a structured learning objective.
**Where in code:** Create a new page route e.g., `client/src/pages/EscapeLab.jsx` leveraging `PhysicsLab` components.
**How:** Create a state machine that requires specific chemical combinations to progress through a series of "locks" or challenges.

### 2. Enhanced Accessibility Controls (WASD/Voicing) — Priority: HIGH | Effort: MEDIUM
**What:** Expand keyboard controls beyond basic tab navigation to include grabbing/moving in 3D, and add explicit "voicing" toggle for actions.
**Why:** PhET prioritizes this heavily. `Lab3D.jsx` has a `sr-only` div, but active voicing of slider changes or chemical selection is missing.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/accessibility.css`.
**How:** Add a "Voicing" toggle that uses the Web Speech API (`window.speechSynthesis`) to announce state changes, and ensure WASD can adjust slider values.

### 3. Practice Activity: Balancing Equations — Priority: MEDIUM | Effort: MEDIUM
**What:** A specific module focused purely on balancing chemical equations before doing the physical mixing.
**Why:** A core competency highlighted by Labster.
**Where in code:** Create a new module e.g. `client/src/pages/Balancing.jsx` and add to `StudentDashboard.jsx`.
**How:** A UI with reactant/product inputs where users adjust coefficients until the equation balances.

### 4. Temperature / Kinetics Controls — Priority: MEDIUM | Effort: MEDIUM
**What:** Add a "Heat/Cool" slider to the 3D lab environment.
**Why:** PhET emphasizes reaction rates and kinetics based on temperature. Alchemistry currently only has concentration sliders.
**Where in code:** `client/src/pages/Lab3D.jsx` (add new slider) and `server/controllers/reactions.controller.js` (or similar logic).
**How:** Add a temperature state. Pass it to the backend reaction logic to affect the outcome or the speed of the animation in `PhysicsLab`.

### 5. Concept Tooltips (Physical/Chemical Properties) — Priority: MEDIUM | Effort: SMALL
**What:** Display key properties (conductivity, flammability) when hovering over a chemical.
**Why:** Labster emphasizes identifying these properties.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/pages/lab.jsx`.
**How:** Add simple title attributes or a custom tooltip component to the chemical labels.

## Quick Wins (< 1 day each)
1.  **Concept Tooltips:** Adding `title` attributes with chemical properties to existing UI elements.
2.  **WASD Slider Controls:** Adding `onKeyDown` handlers to sliders in `Lab3D.jsx` to allow adjustment via WASD keys.
3.  **Basic Web Speech API Integration:** Adding a simple button to read aloud the current reaction state using `speechSynthesis.speak()`.
