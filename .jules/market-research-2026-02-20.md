# Market Research Report
**App:** Alchemistry — A virtual chemistry laboratory for students to conduct organic, inorganic, and titration experiments in a 3D environment.
**Market:** EdTech / Virtual Science Labs
**Date:** 2026-02-20
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual science lab market is dominated by comprehensive platforms like Labster and PraxiLabs that offer highly guided, "gamified" learning experiences with strong safety and theory scaffolding. Alchemistry has a solid technical foundation with interactive 3D simulations (React + Three.js), but it currently functions more as a "sandbox" than a guided educational tool. The biggest opportunity is to bridge this gap by adding contextual guidance, safety awareness features, and deeper educational feedback, transforming it from a "simulator" into a full "learning platform."

## Competitor Analysis
*   **Labster**: The market leader. Key differentiator is its "story-driven" approach (e.g., "Solve a crime using DNA analysis") and high-fidelity 3D. It provides extensive theoretical background and quizzes.
*   **PraxiLabs**: Focuses on accessibility and bilingual support (English/Arabic). Features an AI Lab Assistant ("Oxi") and strong LMS integration. It emphasizes "safety first" with clear warnings.
*   **ChemCollective**: A more academic, less 3D-heavy option. Focuses on stoichiometry and problem-solving (e.g., "Design an experiment to find the concentration").

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Guided Walkthroughs**: Competitors guide students step-by-step (e.g., "Now pick up the beaker"). Alchemistry relies on user intuition or external instruction.
*   **Safety Warnings**: A core component of chemistry education. Competitors explicitly warn about toxic chemicals. Alchemistry has minimal warnings.
*   **Educational Context**: Users expect to know *why* a reaction happens (chemical equations, theory). Alchemistry currently lacks a dedicated theory panel.

### Differentiating Opportunities (Stand-out features)
*   **Lightweight 3D**: Alchemistry's React Three Fiber approach is potentially faster to load than Labster's heavy Unity/WebGL builds, making it more accessible on lower-end devices if optimized.
*   **Direct "Sandbox" Mode**: Unlike highly scripted competitors, Alchemistry's open-ended nature (e.g., in `Organic` or `Lab`) could be marketed as a "free play" mode for advanced students, if properly labeled.

### UX Patterns (Design/interaction patterns common in top products)
*   **"Labpad" / Tablet Overlay**: A common UI pattern where a virtual tablet on the screen displays instructions, theory, and quizzes.
*   **Progress Tracking**: specific milestones (e.g., "Step 1 Complete: Acid Added").

## Prioritised Recommendations

### 1. Guided Experiment Mode (The "Lab Assistant") — Priority: HIGH | Effort: MEDIUM
**What:** An interactive overlay that guides students through the experiment steps (e.g., "Click the HCL bottle", "Set volume to 10ml").
**Why:** Competitors like Labster and PraxiLabs rely heavily on guided inquiry. Students currently may not know the correct order of operations in `Titration.jsx` or `Lab.jsx`.
**Where in code:** `client/src/pages/titration.jsx`, `client/src/pages/lab.jsx`. Create a reusable `GuideOverlay` component.
**How:**
1.  Define a `steps` array for each experiment (e.g., `[{ target: '.hcl-bottle', content: 'Select Hydrochloric Acid' }]`).
2.  Use a state variable `currentStep`.
3.  Render a floating tooltip or modal pointing to the target element.

### 2. Smart Result Feedback — Priority: HIGH | Effort: SMALL
**What:** Enhance the result screen to explain *why* the result occurred, not just a score.
**Why:** Currently, `Titration.jsx` gives a score based on a simple difference calculation. Students need to know if they overshot (too pink) or undershot (colorless) and what that means chemically.
**Where in code:** `client/src/pages/titration.jsx` (inside `saveResult` function).
**How:**
1.  Modify `saveResult` to determine error type: `if (finalCount > target) error = 'overshoot'`.
2.  Return specific feedback strings: "The solution turned too dark pink, indicating you added too much base."
3.  Display this message prominently in the `note-box` or a new result modal.

### 3. Chemical Safety & Info Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Hoverable tooltips on chemical bottles displaying name, molarity, and safety hazards (e.g., "Corrosive").
**Why:** Safety is a primary selling point of virtual labs ("Practice safely"). It also adds educational depth.
**Where in code:** `client/src/pages/lab.jsx` (on `chem-icon-wrapper` elements), `client/src/pages/titration.jsx`.
**How:**
1.  Create a `ChemicalTooltip` component using `radix-ui/react-tooltip` or simple CSS.
2.  Add data attributes or a lookup object for chemical info (e.g., `{ hcl: { name: 'Hydrochloric Acid', hazard: 'Corrosive' } }`).
3.  Wrap chemical images with this tooltip.

### 4. Accessibility Announcements (Screen Reader Support) — Priority: MEDIUM | Effort: SMALL
**What:** Add `aria-live` regions to announce dynamic changes, especially color changes in titration.
**Why:** Competitors like PraxiLabs emphasize accessibility. Currently, the color change in Titration is purely visual, excluding visually impaired users.
**Where in code:** `client/src/pages/titration.jsx`.
**How:**
1.  Add a hidden `div` with `role="status"` and `aria-live="polite"`.
2.  Update its text content when `sColor` state changes (e.g., "Solution turned pink").

### 5. "Real-World" Scenario Wrapper — Priority: LOW | Effort: SMALL
**What:** Frame experiments with a brief story or problem statement.
**Why:** Increases engagement and relevance (Competitor Standard).
**Where in code:** `client/src/pages/Dashboard.jsx` and experiment intro modals.
**How:**
1.  Update Dashboard cards to include a "Scenario" line (e.g., Titration: "Determine Acid Concentration").
2.  Add a simple "Mission Brief" modal when entering a lab (e.g., "Your task: Neutralize the unknown acid sample...").

## Quick Wins (< 1 day each)
1.  **Smart Result Feedback**: purely logic and text changes in `titration.jsx`.
2.  **Safety Tooltips**: adding simple `title` attributes or a CSS tooltip to chemical images.
3.  **Scenario Text**: Updating `Dashboard.jsx` text to be more scenario-driven.
