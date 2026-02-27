# Market Research Report
**App:** Alchemistry - A 3D virtual chemistry laboratory for students.
**Market:** Virtual Science Simulation / EdTech.
**Date:** 2025-10-26
**Competitors Researched:** PraxiLabs, Labster, ChemCollective, PhET.

## Executive Summary
The virtual lab market is driven by safety, accessibility, and immersive realism. While Alchemistry excels in visual fidelity (Three.js), it lags behind leaders like PraxiLabs and Labster in pedagogical scaffolding—specifically **safety protocols** and **guided onboarding**. Adding these features would transform it from a "simulator" to a complete "educational platform" without significant architectural changes.

## Competitor Analysis
- **PraxiLabs:** Highly immersive 3D. **Key Differentiator:** Strict safety protocols (PPE checks) before every experiment.
- **Labster:** Story-driven, gamified learning. **Key Differentiator:** Contextual theory and quizzes integrated into the flow.
- **ChemCollective:** Academic focus. **Key Differentiator:** "Virtual Lab" interface mimics a real workbench with precise data logging.
- **PhET:** Accessibility-first 2D simulations. **Key Differentiator:** Extremely simple, intuitive controls with immediate feedback.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Safety Checks:** Students expect to learn *safe* lab practices. Alchemistry currently has no PPE or safety warnings.
- **Guided Tour/Onboarding:** New users are dropped directly into the 3D environment without explanation of controls.
- **Real-time Data Visualization:** Titration experiments in competitors show live pH curves; Alchemistry relies solely on visual color changes.

### Differentiating Opportunities (Stand-out features)
- **"Holographic" Chemical Info:** Use the existing 3D canvas to show molecular data when hovering over chemicals (Leveraging `FloatingMolecule` tech).
- **Gamified "License to Experiment":** Unlock more dangerous chemicals only after passing safety quizzes (Gamification + Safety).

### UX Patterns (Design/interaction patterns common in top products)
- **"Notebook" Sidebar:** Persistent area to record observations (Data collection is key in science).
- **Step-by-Step Modals:** Breaking complex procedures (like Titration) into distinct, guided phases.

## Prioritised Recommendations

### 1. Safety Check Modal (PPE) — Priority: HIGH | Effort: SMALL
**What:** A modal before entering `Lab.jsx` requiring users to "Equip" virtual Lab Coat and Goggles.
**Why:** Standard in PraxiLabs/Labster. Reinforces learning objectives and adds immersion.
**Where in code:** Create `src/components/SafetyCheck.jsx` and render conditionally in `Lab.jsx` (before `CanvasContainer`).
**How:** Simple state `hasPPE` (bool). If false, show modal. On click "Equip", set true and unmount modal.

### 2. Lab Onboarding Tour — Priority: HIGH | Effort: MEDIUM
**What:** A guided walk-through highlighting key UI elements (Chemical Rack, Beaker, Start Button).
**Why:** Users currently have to guess how to interact with the 3D environment.
**Where in code:** `src/pages/lab.jsx`.
**How:** Use a library like `react-joyride` or custom overlay. Highlight `.chemical-rack` and `.action-button` sequentially on first visit (check `localStorage`).

### 3. Real-time Titration Graph — Priority: MEDIUM | Effort: MEDIUM
**What:** A line chart showing pH vs Volume added during titration.
**Why:** Competitors (ChemCollective) provide quantitative data, not just qualitative (color change).
**Where in code:** `src/pages/titration.jsx`.
**How:** Integrate `recharts`. In `useEffect` (timer logic), push `{volume: count/10, pH: calculated_pH}` to a state array and render in a new `<div className="glass-panel graph-panel">`.

### 4. Chemical Info Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Hover cards showing Molar Mass, Hazard info, and Formula for each chemical.
**Why:** Adds educational depth without cluttering the UI.
**Where in code:** `src/pages/lab.jsx` inside `.chemical-rack`.
**How:** Add `title` attribute or a custom `Tooltip` component wrapping the `img` tags in the rack. Data can be stored in a simple `constants.js` object.

### 5. Expanded Lab Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** A slide-out sidebar to type notes and save them to `localStorage` (or Supabase).
**Why:** Science is about observation. Competitors always have a "Lab Journal".
**Where in code:** New component `src/components/LabNotebook.jsx`, added to `Lab.jsx` layout.
**How:** Textarea with auto-save to `localStorage`. potentially sync with `saveResult` in `Result.jsx`.

### 6. Accessibility Controls — Priority: MEDIUM | Effort: SMALL
**What:** Toggle for "Reduced Motion" (disable 3D spins) and "High Contrast" (for colorblindness in titration).
**Why:** Essential for inclusivity (PhET does this well).
**Where in code:** `src/components/Navbar.jsx` (Settings menu) and `accessibility.css`.
**How:** Context provider `ThemeContext`. `HighContrast` adds a CSS class. `ReducedMotion` pauses GSAP animations in `Lab.jsx`.

### 7. Export Results to CSV — Priority: LOW | Effort: SMALL
**What:** Button in `History` or `Result` to download experiment data.
**Why:** Allows students to submit data to teachers.
**Where in code:** `src/pages/result.jsx` or `history.jsx`.
**How:** Function to convert `data` state to CSV string and trigger blob download.

### 8. Periodic Table Reference — Priority: LOW | Effort: SMALL
**What:** A quick-reference modal showing a periodic table.
**Why:** Common utility in chemistry apps.
**Where in code:** `src/components/Navbar.jsx`.
**How:** Static image or simple grid component in a modal, accessible from the nav.

### 9. Quick-Reset Experiment Button — Priority: LOW | Effort: TINY
**What:** Button to reset chemical levels to 0 without reloading the page.
**Why:** Encourages trial-and-error (Playful learning).
**Where in code:** `src/pages/lab.jsx`.
**How:** `resetHandler` function setting all `chemX` states to 0.

### 10. Feedback/Bug Report Form — Priority: LOW | Effort: TINY
**What:** Link to a Google Form or internal form for bugs.
**Why:** Captures user friction early.
**Where in code:** `src/components/Navbar.jsx` or Footer.
**How:** Simple `<a>` tag or modal.

## Quick Wins (< 1 day each)
1. **Quick-Reset Button:** Just adds a button and a handler function in `Lab.jsx`.
2. **Chemical Info Tooltips:** Purely UI addition (HTML `title` or simple CSS tooltip) using existing chemical images.
3. **Safety Check Modal:** A simple overlay component using existing styles (`glass-panel`).
