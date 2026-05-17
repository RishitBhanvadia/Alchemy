# Market Research Report
**App:** Alchemistry is a web-based 3D virtual chemistry laboratory allowing students to safely conduct interactive chemical experiments with real-time feedback and an AI tutor.
**Market:** Educational Technology (EdTech) / STEM Virtual Lab Simulations
**Date:** 2026-05-17
**Competitors Researched:** Labster, PhET Interactive Simulations, ChemCollective

## Executive Summary
The virtual chemistry lab space is moving from static sandboxes to guided, assessable workflows with interactive feedback. While Alchemistry has a strong foundation with 3D Three.js rendering and basic AI tutoring, it lacks several standard (table-stakes) features found in market leaders like Labster and PhET. Top opportunities involve adding experiment guides, saving and exporting data, accessibility features, and structured assessments to better serve both teachers and students.

## Competitor Analysis
- **Labster:** Leads with gamified, guided simulation scenarios embedded within a storyline, strong LMS integrations, and detailed in-experiment assessments.
- **PhET Interactive Simulations:** Excels at providing highly accessible, visually clear sandboxes with variable manipulation, real-time visual feedback, and multi-language support.
- **ChemCollective:** Focuses on realistic computational chemistry, providing virtual workbenches where students can pour reagents freely and track molarities precisely.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Guided tutorial/onboarding mode for new students.
- Ability to save partial experiment progress.
- Exportable data/logs (CSV/PDF) for lab reports.

### Differentiating Opportunities (Stand-out features)
- Contextual hints tied to specific chemical reactions rather than a generic AI chat.
- "Free pour" mechanics for custom concentration inputs.
- Real-time graphing of reaction variables (e.g., pH curves during titration).

### UX Patterns (Design/interaction patterns common in top products)
- Step-by-step experiment checklists/instructions embedded in the UI.
- Direct manipulation of lab equipment (drag-and-drop pouring) rather than slider controls.
- Visual highlighting of interactable objects in the 3D space.

## Prioritised Recommendations

### 1. Step-by-Step Experiment Checklist — Priority: HIGH | Effort: MEDIUM
**What:** Add a persistent, collapsible sidebar showing current experiment steps and objectives.
**Why:** Competitors like Labster heavily rely on guided workflows. Reduces student confusion.
**Where in code:** `client/src/pages/Lab3D.jsx` and new component `client/src/components/ExperimentGuide.jsx`
**How:** Create an `ExperimentGuide` component referencing a list of steps. Update step status on chemical additions.

### 2. Export Experiment Results to CSV/PDF — Priority: HIGH | Effort: SMALL
**What:** Allow students to download their reaction history and results.
**Why:** Crucial for homework submissions; a standard feature in EdTech.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/history.jsx`
**How:** Add a "Download Lab Report" button using the `useHistoryStore` state logs.

### 3. Interactive Equipment Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Show the name and current volume/concentration when hovering over 3D beakers.
**Why:** PhET and ChemCollective provide immediate data visibility without looking at sidebars.
**Where in code:** `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Utilize `react-three/drei`'s `<Html>` component to attach overlay text to the mesh pointer events (`onPointerOver`).

### 4. Direct Numerical Input for Chemical Levels — Priority: MEDIUM | Effort: SMALL
**What:** Allow typing exact percentages next to the chemical level controls.
**Why:** Improves accessibility and precision, expected by science students.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Convert the text display for sliders into a controlled input tied to `chemA` and `chemB` values.

### 5. Contextual AI Hints based on Reaction State — Priority: MEDIUM | Effort: MEDIUM
**What:** Pre-fill or prompt the AI Tutor with the current reaction state and chemicals selected.
**Why:** Makes the existing AI Tutor much more proactive and helpful, standing out from competitors.
**Where in code:** `client/src/components/AiTutorPanel.jsx` and `client/src/pages/Lab3D.jsx`
**How:** Pass `chemA`, `chemB`, etc. as props or context to `AiTutorPanel` to generate an initial contextual system prompt.

### 6. Real-Time graphing — Priority: LOW | Effort: LARGE
**What:** A 2D chart overlay showing simulated changes over time.
**Why:** Essential for Titration labs; highly requested in science simulations.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Integrate a charting library to plot simulated data points during the reaction phase.

### 7. "Reset to Last Step" Action — Priority: LOW | Effort: MEDIUM
**What:** Add an "Undo" or "Reset to last chemical addition" button instead of a full lab reset.
**Why:** Prevents frustration when a student makes a small mistake near the end of an experiment.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`
**How:** Store a history array of chemical states in `labStore` and add an Undo method.

### 8. Enhanced Accessibility: High Contrast Labels — Priority: MEDIUM | Effort: SMALL
**What:** Improve contrast ratio of chemical labels in the UI.
**Why:** PhET's major selling point is accessibility.
**Where in code:** `client/src/pages/Lab3D.css`
**How:** Ensure text colors meet WCAG AAA contrast guidelines.

### 9. Multi-language Support Foundation — Priority: LOW | Effort: LARGE
**What:** Extract hardcoded text strings into a translation dictionary.
**Why:** To compete globally with PhET.
**Where in code:** Entire `client/src`
**How:** Introduce `i18next` or a simple Context-based dictionary and replace hardcoded UI strings.

### 10. Gamified "Badges" for Discovering Reactions — Priority: LOW | Effort: MEDIUM
**What:** Award badges when users successfully perform unique hidden reactions.
**Why:** Increases engagement, taking a page from Labster's playbook.
**Where in code:** `client/src/pages/Profile.jsx` and Supabase DB
**How:** Create a `user_badges` table and display them in the `Profile` component.

## Quick Wins (< 1 day each)
1. Export Experiment Results to CSV (Simple data mapping of existing state).
2. Direct Numerical Input for Chemical Levels (Converting text to input).
3. Contextual AI Hints (Passing existing lab state to the AI component).