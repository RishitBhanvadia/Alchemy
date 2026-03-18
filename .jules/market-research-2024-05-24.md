# Market Research Report
**App:** Alchemistry is a web-based educational platform that provides students with an interactive, 3D virtual chemistry laboratory for safe, guided experimentation and provides teachers with analytics and classroom management tools.
**Market:** EdTech / Virtual STEM Laboratories
**Date:** 2024-05-24
**Competitors Researched:** Labster, PraxiLabs, ChemCollective, Beyond Labz

## Executive Summary
The virtual chemistry lab market is shifting from pure open-ended sandbox environments to guided, curriculum-aligned learning tools. Top platforms combine the visual engagement of 3D laboratories with structured pedagogical features like step-by-step guidance, built-in quizzes, safety protocol training, and detailed reporting. For Alchemistry, the core 3D simulation and teacher analytics are strong, but the platform lacks structured in-lab guidance and immediate pedagogical feedback during the experiment process. Adding these features will bridge the gap between "playing with chemicals" and structured learning.

## Competitor Analysis
* **Labster:** Market leader in immersive 3D simulations. Differentiates with strong narrative-driven scenarios, built-in formative assessments (quizzes mid-experiment), and comprehensive theory tabs.
* **PraxiLabs:** Focuses on accessibility and clear step-by-step procedures. Features a persistent "Lab Assistant" panel that guides users through exact actions and explains the "why" behind each step.
* **ChemCollective:** Older but highly respected for its educational rigor. Differentiates with a "Virtual Workbench" that emphasizes quantitative analysis, requiring students to manually record measurements and calculate molarities.
* **Beyond Labz:** Strong open-ended sandbox that still includes structured worksheets. Differentiates with a "Lab Book" feature where students must record observations and data points manually before submitting.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
* **Step-by-step experiment procedures:** Competitors provide a structured checklist of steps for each experiment. Alchemistry has an open sandbox (e.g., in Lab3D) but relies on external knowledge or AI hints for what to do.
* **In-lab theory/concept explanations:** Top products explain *why* a reaction happens during the experiment. Alchemistry shows the result but lacks a dedicated panel for underlying chemical theory.
* **Safety equipment simulation:** Most virtual labs require students to "put on" PPE (goggles, gloves) before interacting with chemicals to reinforce real-world habits.

### Differentiating Opportunities (Stand-out features)
* **Interactive Lab Notebook:** Allowing students to manually log observations, measurements, and hypotheses during the experiment, rather than just auto-logging the final result.
* **Formative in-experiment questions:** Pausing the reaction simulation to ask the student a quick multiple-choice question to verify understanding before showing the result.

### UX Patterns (Design/interaction patterns common in top products)
* **Persistent "Mission/Procedure" Sidebar:** A UI panel that stays open during the 3D simulation, showing the current objective and checklist.
* **Post-experiment reflection:** After an experiment, prompting the student to summarize their findings before saving the result to history.

## Prioritised Recommendations

### 1. Persistent Procedure Checklist — Priority: HIGH | Effort: MEDIUM
**What:** Add a collapsible sidebar in the 3D Lab that outlines a step-by-step procedure for specific predefined experiments (e.g., "Synthesizing Water: 1. Add HCl, 2. Add NaOH...").
**Why:** Transitions the lab from a pure sandbox to a guided educational tool, which is standard in top competitors like PraxiLabs.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/`
**How:** Create a `ProcedurePanel` component that reads from a new `procedures` array in `labStore`. Update the checklist state as the user interacts with the sliders (`chemA`, `chemB`, etc.).

### 2. Required PPE (Safety Gear) Check — Priority: HIGH | Effort: SMALL
**What:** Require users to click a "Put on Safety Goggles & Gloves" button before the chemical sliders become active.
**Why:** A universal table-stakes feature in educational labs (Labster, Beyond Labz) to reinforce real-world safety habits.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a `hasPPE` boolean state. If false, disable the `slider-grid` and show a prominent "Equip PPE" button.

### 3. Interactive Lab Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** Allow students to add personal notes or observations to an experiment result before it is saved to their history.
**Why:** Encourages active learning rather than passive clicking, mirroring ChemCollective's and Beyond Labz's pedagogical approach.
**Where in code:** `client/src/components/ResultModal.jsx` and `client/src/pages/history.jsx`
**How:** Add a text area in `ResultModal` for "Student Observations". Pass this data to the `experiment_results` table in Supabase and display it in the `History` page table.

### 4. Post-Experiment Reflection/Quiz — Priority: MEDIUM | Effort: MEDIUM
**What:** After a successful reaction, ask one conceptual question related to the outcome before closing the result modal.
**Why:** Labster uses this effectively to ensure students understand the chemistry behind the visual animation.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Extend the `ResultModal` to include a simple multiple-choice question derived from the `reactionResult` data before allowing the user to "Save & Close".

### 5. Quantitative Measurement Tool (Burette/Scale) — Priority: LOW | Effort: LARGE
**What:** Introduce precise volume/mass measurements rather than simple percentage sliders for chemicals.
**Why:** Required for advanced high school/college curriculums (like ChemCollective's focus on exact molarity calculations).
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/3d-animations/PhysicsLab.jsx`
**How:** Replace the 0-100% sliders with input fields for specific mL/grams, and update the 3D liquid scaling logic to reflect precise volumes. (High effort due to 3D adjustments).

## Quick Wins (< 1 day each)
1. **Required PPE Check:** Easy state toggle to enforce safety habits before experimentation.
2. **Interactive Lab Notebook:** Simple UI addition to the existing `ResultModal` and a minor database update to store notes.
3. **Procedure Panel (Basic):** A static UI component overlaying the 3D canvas listing suggested experiment recipes to try.
