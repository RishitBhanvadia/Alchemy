# Market Research Report
**App:** A virtual chemistry laboratory that enables students to conduct realistic 3D chemical reactions and volumetric analysis (titrations) in a browser-based environment.
**Market:** Virtual Science Labs / STEM Education Software
**Date:** 2024-05-30
**Competitors Researched:** Labster, Beyond Labz, ChemCollective, PraxiLabs

## Executive Summary
The virtual chemistry lab market is transitioning from 2D flash-based simulations to fully immersive 3D, gamified experiences (led by Labster and PraxiLabs). Alchemistry sits in a sweet spot: it offers modern 3D visualizations but remains highly accessible via browser without heavy licensing or downloads. The top market opportunity for Alchemistry is bridging the gap between open-ended exploration (which it currently does well) and guided, educator-driven instruction. Competitors excel by offering auto-grading, LMS integration, and built-in scaffolding (lab manuals/instructions) which Alchemistry currently lacks. By adding lightweight instructional features and expanding its analytical outputs (like real-time graphing), Alchemistry can significantly increase its value in formal educational settings.

## Competitor Analysis
*   **Labster:** The market leader. Focuses on gamified, narrative-driven 3D simulations. Highly structured.
    *   *Differentiator:* Story-based scenarios (e.g., solve a crime using chemistry), LMS integration, auto-graded quizzes.
*   **Beyond Labz:** Focuses on open-ended, highly realistic sandbox environments. Known for high scientific accuracy.
    *   *Differentiator:* Ability to make safe mistakes (explosions, wrong mixtures), built-in lab worksheets, data recording and graphing tools.
*   **ChemCollective:** A free, older, but widely used 2D platform.
    *   *Differentiator:* Autograded virtual labs (limiting reagents, stoichiometry) where the platform generates unknown solutions and grades student calculations.
*   **PraxiLabs:** Immersive 3D virtual labs for higher education and schools.
    *   *Differentiator:* Guided experiments, bilingual support, assessment tools, and detailed lab reports.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Built-in Lab Instructions/Guided Scaffolding:** Competitors don't just provide a sandbox; they guide the student on *what* to do.
*   **Assessments/Quizzes:** Verification of conceptual understanding alongside the practical experiment.
*   **Data Export/Lab Reports:** Ability for students to download their results to submit to a teacher.

### Differentiating Opportunities (Stand-out features)
*   **"Unknown" Generation (Auto-grading):** Generating random unknown concentrations for students to determine via titration (seen in ChemCollective).
*   **Real-time Graphing:** Plotting pH curves during titrations (like Beyond Labz).
*   **"Mistake" Physics:** Realistic feedback when mixing incompatible chemicals (e.g., explosions, broken glassware).

### UX Patterns (Design/interaction patterns common in top products)
*   **Split-pane views:** Showing the 3D lab on one side and the lab manual/worksheet on the other.
*   **Gamified progress indicators:** Visual cues for completing steps in an experiment.
*   **Tooltips for glassware:** Hovering over items reveals their capacity and current contents.

## Prioritised Recommendations

### 1. Titration Real-time pH Graphing — Priority: HIGH | Effort: MEDIUM
**What:** Add a live line chart plotting volume added (x-axis) vs. pH (y-axis) during the titration experiment.
**Why:** Top competitors (Beyond Labz, PraxiLabs) all feature real-time data visualization. This bridges the gap between the visual color change and the mathematical concept.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Integrate `recharts` or `chart.js`. Map the `count` variable (volume) to a calculated pH value (using a weak acid/strong base approximation curve) and update the chart state on every interval tick in the `useEffect` timer.

### 2. "Unknown" Concentration Mode in Titration — Priority: HIGH | Effort: SMALL
**What:** Add a mode where the acid concentration is hidden (randomized between 0.5M and 2M), and the user must calculate and input it.
**Why:** ChemCollective's most praised feature is auto-graded unknowns. This turns a simple interaction into an actual assessment.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Add a toggle for "Assessment Mode". Randomize the underlying molarity state. Add an input field for the user to submit their calculated molarity before calling `saveResult`, comparing their input to the hidden state.

### 3. Lab Report Export (PDF/CSV) — Priority: HIGH | Effort: SMALL
**What:** Allow users to download their experiment history as a CSV or PDF.
**Why:** Table stakes for any educational tool. Teachers need a way to collect proof of completion.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an "Export Log" button. Use a library like `papaparse` to convert the `experiments` state array into a CSV string, create a Blob, and trigger a download.

### 4. Interactive Lab Manual/Guided Steps — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out panel containing step-by-step instructions for standard experiments.
**Why:** Gamified guidance (Labster) prevents students from getting lost in open-ended sandboxes.
**Where in code:** `client/src/pages/lab.jsx` and `client/src/pages/titration.jsx`
**How:** Create a new `LabManual` component. Pass down current states (e.g., `chemA`, `drop`) as props so the manual can visually "check off" steps as the user completes them.

### 5. Enhanced Reaction Hazards (Explosions/Spills) — Priority: MEDIUM | Effort: MEDIUM
**What:** Visual and auditory feedback for mixing incompatible or dangerous concentrations.
**Why:** Beyond Labz users love the ability to "safely fail." It adds realism and engagement.
**Where in code:** `client/src/pages/result.jsx` and `client/src/pages/lab.jsx`
**How:** If a specific combination of chemicals exceeds a threshold, replace the standard `boom.gif` in `result.jsx` with a "Glass Break" or "Fire" animation, and log a negative score in the history.

### 6. Dynamic Glassware Tooltips — Priority: LOW | Effort: SMALL
**What:** Hover tooltips showing the current volume and contents of the test tube/beaker.
**Why:** Standard UX pattern in virtual labs to improve accessibility and precision.
**Where in code:** `client/src/components/testtube.jsx` and `client/src/pages/lab.jsx`
**How:** Wrap the 3D canvas or test tube div with a standard React tooltip library, passing the current `chemA`, `chemB`, etc., states to display the sum.

### 7. Educator Dashboard View — Priority: LOW | Effort: LARGE
**What:** A separate view for teachers to see aggregate statistics of their students' performance.
**Why:** Essential for selling/marketing to schools, moving from a B2C to B2B model.
**Where in code:** New route `/educator`, `server/controllers/`
**How:** Requires backend roles (student vs. educator). Create new Supabase queries to fetch `experiment_results` grouped by a class ID.

### 8. Stoichiometry Assessment Prompts — Priority: LOW | Effort: MEDIUM
**What:** Before viewing the final result, prompt the user to predict the products or balance the equation.
**Why:** Increases cognitive load; prevents students from just clicking through to see the explosion.
**Where in code:** `client/src/pages/result.jsx` (before data displays)
**How:** Add a modal that intercepts the rendering of the `Result` data. Show the reactants and require the user to type the product formula before the `boom.gif` plays.

### 9. Custom Experiment Builder — Priority: LOW | Effort: LARGE
**What:** Allow educators to define custom combinations of chemicals and expected results.
**Why:** Provides endless replayability and adaptability to different curricula (a key feature of Beyond Labz).
**Where in code:** `client/src/pages/Dashboard.jsx`, Database schema
**How:** Create a UI for teachers to add rows to a new `custom_experiments` table in Supabase, which the `lab.jsx` page then fetches to populate the chemical rack.

### 10. Multi-trial Averaging in History — Priority: LOW | Effort: SMALL
**What:** Automatically calculate the average volume used across multiple titration attempts.
**Why:** Good laboratory practice requires 3 concurrent trials. The software should support this methodology.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a "Group by Experiment" toggle that groups recent identical experiments and displays the statistical mean and variance of their scores/volumes.

## Quick Wins (< 1 day each)
1.  **Lab Report Export:** Implement CSV download in History using PapaParse.
2.  **"Unknown" Concentration Mode:** Add a toggle to randomize base/acid concentration in Titration.
3.  **Dynamic Tooltips:** Add hover states showing total volume in the Lab test tube.