# Market Research Report
**App:** Alchemistry — A virtual 3D chemistry laboratory for students.
**Market:** EdTech / Virtual Science Labs (Higher Ed & K-12)
**Date:** 2026-02-26
**Competitors Researched:** PraxiLabs, ChemCollective, Gizmos (ExploreLearning), Labster

## Executive Summary
Alchemistry offers a solid 3D visual foundation with its "Lab" and "Titration" modules, placing it in the competitive "Virtual Lab Simulation" market. However, compared to market leaders like PraxiLabs and Labster, it lacks critical "educational scaffolding" — specifically safety protocols (PPE), guided inquiry (tutorials), and data analysis tools. The market standard has shifted from pure simulation to "gamified safety and analysis," where students must prepare for the lab and analyze results, not just mix chemicals. The biggest opportunity is to implement these "table stakes" features which are low-effort but high-value for educators.

## Competitor Analysis

| Competitor | Key Differentiators | UX Patterns |
| :--- | :--- | :--- |
| **PraxiLabs** | **Safety & AI:** "Oxi" AI assistant guides students; enforces virtual PPE (goggles/coat) before starting. | immersive 3D, gamified progress, "Lab Partner" avatar. |
| **ChemCollective** | **Authenticity:** Focuses on realistic stoichiometry and data; "Virtual Lab" feels like a workbench. | Drag-and-drop chemicals, realistic inventory systems. |
| **Gizmos** | **Inquiry-Based:** "Exploration Sheets" guide students; focuses on "What if?" scenarios with instant feedback. | Sliders for variables, real-time graphs, clear "Reset" flows. |
| **Labster** | **Storytelling:** CSI-style missions; high production value 3D. | Narrative-driven, quiz checkpoints, failure is a learning moment. |

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
*   **Virtual Safety Checks:** Users can currently pour acid without "putting on" goggles. Competitors strictly enforce this.
*   **Data Export:** No way to save/export results for homework.
*   **Instructional Overlay:** Users are dropped into the 3D lab with no "How-To".

### Differentiating Opportunities (Stand-out features)
*   **Real-time Titration Graph:** While competitors show static results, Alchemistry could animate the pH curve as the user drops titrant.
*   **"Why did it explode?" Feedback:** Current feedback is generic. Detailed chemical explanations would boost educational value.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips:** Small "?" icons or hover states explaining chemical properties.
*   **Keyboard Navigation:** Critical for accessibility (WCAG AA) in education; currently Alchemistry is mouse-only.

## Prioritised Recommendations

### 1. Virtual PPE Safety Check — Priority: HIGH | Effort: SMALL
**What:** A modal before entering the Lab/Titration page: "Safety First! Put on your: [ ] Goggles [ ] Lab Coat [ ] Gloves".
**Why:** Standard in 100% of top competitors. Teaches safety habits (critical for schools).
**Where in code:** `client/src/pages/lab.jsx` (wrap content in conditional `hasPPE`).
**How:** Simple React state `showSafetyModal`. Block interaction until all 3 checkboxes are ticked.

### 2. Interactive "Lab Assistant" Tour — Priority: HIGH | Effort: MEDIUM
**What:** A 3-step guided tour on first visit: "1. Select Chemical", "2. Adjust Concentration", "3. Initiate Reaction".
**Why:** Users currently have to guess the workflow. Gizmos/PraxiLabs use this to reduce cognitive load.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** Use a library like `react-joyride` or custom overlay component triggered by `!localStorage.getItem('seenTour')`.

### 3. Real-Time Titration Curve Graph — Priority: MEDIUM | Effort: MEDIUM
**What:** A line chart that updates as titrant is added, plotting pH (y) vs Volume (x).
**Why:** Visualizing the "equivalence point" is the core learning objective of titration. Competitors like "Titration Curve Simulator" focus entirely on this.
**Where in code:** `client/src/pages/titration.jsx`.
**How:** Use `recharts`. Push `{ volume: count, pH: calculatedPH }` to an array in state and render the LineChart.

### 4. Accessibility: Keyboard-Navigable Chemicals — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow users to tab through chemicals and use 'Enter'/'Arrow Keys' to select/adjust concentration.
**Why:** Required for educational software compliance (WCAG). Current `div`s with `onClick` are inaccessible.
**Where in code:** `client/src/pages/lab.css` (focus styles), `client/src/pages/lab.jsx`.
**How:** Add `tabIndex="0"`, `role="button"`, and `onKeyDown` handlers to `.chem-icon-wrapper`.

### 5. "Lab Report" Export (CSV/PDF) — Priority: MEDIUM | Effort: SMALL
**What:** A "Download Report" button on the Results page.
**Why:** Students need to submit evidence of their work.
**Where in code:** `client/src/pages/result.jsx`.
**How:** Create a function that formats `location.state` (chemicals used) and `experiment_results` into a CSV string and triggers download.

### 6. Chemical Property Tooltips — Priority: LOW | Effort: SMALL
**What:** Hovering over a chemical bottle shows its formula, molarity, and hazards.
**Why:** Reinforces chemical knowledge without cluttering the UI.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** Add a `title` attribute or a custom Tooltip component to `.chem-icon-wrapper`.

### 7. Responsive Titration Layout — Priority: LOW | Effort: LARGE
**What:** Refactor `Titration.jsx` to avoid absolute positioning (`top: 100px`, `left: 100px`) and SVG paths dependent on fixed pixels.
**Why:** Competitors work on tablets/Chromebooks. Current layout breaks on small screens.
**Where in code:** `client/src/pages/titration.jsx`, `client/src/pages/titration.css`.
**How:** Use Flexbox/Grid. Replace hardcoded SVG paths with scalable vector graphics or percentages.

### 8. Experiment Timer/Stopwatch — Priority: LOW | Effort: SMALL
**What:** A simple timer that starts when reaction begins.
**Why:** Some experiments require timing. Adds utility.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** `useEffect` with `setInterval` when `animate` is true.

### 9. "Reaction History" Sidebar — Priority: LOW | Effort: MEDIUM
**What:** A collapsible sidebar showing the last 5 reactions in the current session.
**Why:** Allows comparing results without leaving the page.
**Where in code:** `client/src/pages/lab.jsx`.
**How:** Maintain a `history` array in state/context.

### 10. Educational Error Messages — Priority: LOW | Effort: SMALL
**What:** When a reaction fails or produces nothing, explain *chemically* why (e.g., "No reaction: Copper is less reactive than Hydrogen").
**Why:** Turns failure into learning (Labster method).
**Where in code:** `client/src/pages/result.jsx` or `server/controllers/resultController.js`.
**How:** Enhance the backend response to include an `explanation` field.

## Quick Wins (< 1 day each)
1.  **Virtual PPE Safety Check:** Pure frontend modal, huge educational value.
2.  **Lab Report Export:** Simple JS text manipulation on the Result page.
3.  **Chemical Tooltips:** Adding `title` attributes to existing elements.
