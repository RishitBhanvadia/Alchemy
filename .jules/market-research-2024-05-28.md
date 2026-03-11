# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory built with React and Three.js, enabling students to safely conduct interactive 3D simulations of organic, inorganic, and titration experiments.
**Market:** EdTech / Virtual Science Labs / STEM Education
**Date:** 2024-05-28
**Competitors Researched:** Labster, ChemCollective, Beyond Labz, Futuclass

## Executive Summary
The virtual chemistry lab market is highly focused on bridging the gap between visual simulation and theoretical understanding, while ensuring student safety and engagement. Top competitors excel by providing guided learning paths, real-time chemical equations, and robust tools for educators (like exportable lab reports). Alchemistry has a strong 3D visual foundation and a great aesthetic, but it lacks the contextual guidance, theoretical reinforcement, and exportability expected in modern EdTech products. By implementing in-app lab manuals, dynamic equations, and report exports, Alchemistry can significantly elevate its educational value.

## Competitor Analysis
*   **Labster:** The market leader in 3D virtual labs. Key differentiators include highly immersive 3D environments, gamified storylines, pre-lab quizzes, and strict virtual safety protocols (e.g., putting on gloves/goggles).
*   **ChemCollective:** A robust 2D simulation tool. It stands out by allowing unguided, open-ended experiments where students must rely on their knowledge to mix reagents, strongly emphasizing real-time chemical equations and data tracking.
*   **Beyond Labz:** Focuses on high-fidelity simulations for higher education. Features a highly realistic lab bench setup, interactive periodic tables, and comprehensive lab books for recording data.
*   **Futuclass:** A VR-focused, highly gamified platform. It breaks down complex topics into short puzzle-like modules with instant feedback to keep younger students engaged.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **In-App Instructions:** Competitors embed instructions. Alchemistry tells users to "Refer Your Chemistry Lab Manual Page - 51".
*   **Exportable Results:** Students need to submit work to teachers. Alchemistry shows history but lacks an export feature.
*   **Smooth State Reset:** Alchemistry relies on jarring page reloads (`window.location.reload()`) to reset experiments.

### Differentiating Opportunities (Stand-out features)
*   **Theoretical Reinforcement:** Showing balanced chemical equations dynamically as visual reactions occur.
*   **Gamification/Achievements:** Rewarding students for perfect titrations or consistent lab usage.
*   **Pre-lab Quizzes:** Ensuring students understand the theory before interacting with the simulation.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Onboarding:** Tooltips or guided tours for first-time users.
*   **Virtual Safety Checks:** Requiring users to "equip safety gear" to build good real-world habits.
*   **Detailed Error Feedback:** Explaining exactly *why* an experiment failed, rather than just giving a low score.

## Prioritised Recommendations

### 1. Integrated Lab Manual Panel — Priority: HIGH | Effort: SMALL
**What:** A slide-out panel containing the step-by-step lab instructions, replacing the physical manual requirement.
**Why:** Competitors like Labster keep users immersed with in-app instructions. Leaving the app to read a physical manual breaks flow.
**Where in code:** `client/src/pages/organic.jsx` and `client/src/pages/inorganic.jsx`
**How:** Create a `<LabManualPanel>` component that toggles visibility. Store the text for Page 51 and Page 70 in a local JSON file and render it dynamically.

### 2. Real-time Chemical Equations Display — Priority: HIGH | Effort: MEDIUM
**What:** Show the balanced chemical equation dynamically as users mix chemicals in the lab.
**Why:** A core feature in tools like ChemCollective. It connects the visual color change with the underlying chemical theory.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a mapping object for chemical combinations (e.g., if `chemA` and `chemB` > 0, return `HCl + NaOH → NaCl + H2O`). Render this string in the UI below the test tube visualization.

### 3. CSV Export for Experiment Logs — Priority: HIGH | Effort: SMALL
**What:** A "Download CSV" button to export the user's experiment history.
**Why:** Essential for the EdTech market. Students must be able to submit lab reports or logs to their teachers.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `<ExportButton>` that maps the `experiments` state array into a CSV string (using standard JS or a tiny library) and triggers a browser download.

### 4. Detailed Error Feedback for Titration — Priority: HIGH | Effort: SMALL
**What:** Provide specific feedback explaining *why* a titration failed (e.g., "You added 2mL too much").
**Why:** Educational tools must explain errors to facilitate learning, rather than just providing a generic "Overshot" message.
**Where in code:** `client/src/pages/titration.jsx` (inside `saveResult` function)
**How:** Enhance the `feedback` logic to calculate the exact difference between the user's `count` and the target equivalence point from the `data.points` array, and display this in the UI message.

### 5. Contextual Onboarding / Tooltips — Priority: MEDIUM | Effort: MEDIUM
**What:** A guided "how-to" overlay for first-time users.
**Why:** Competitor platforms use guided tours to prevent user confusion in complex simulation interfaces.
**Where in code:** `client/src/pages/Dashboard.jsx`, `client/src/pages/lab.jsx`
**How:** Use a `hasSeenTour` flag in `localStorage`. If false, render a simple overlay or sequential tooltips pointing to key controls (like the chemical sliders).

### 6. Smooth Experiment Reset — Priority: MEDIUM | Effort: SMALL
**What:** Reset experiment state seamlessly without a hard page reload.
**Why:** `window.location.reload()` breaks the Single Page Application (SPA) experience and immersion.
**Where in code:** `client/src/pages/titration.jsx`
**How:** Replace the `window.location.reload()` call in the "RESET EXPERIMENT" button with a helper function that resets all local states (e.g., `setCount(0)`, `setAddAcid(false)`, `setStop(false)`).

### 7. Gamification Badges — Priority: MEDIUM | Effort: MEDIUM
**What:** Award visual badges based on user performance (e.g., "Perfect Titration" or "10 Experiments Completed").
**Why:** Platforms like Futuclass use gamification to drive student engagement and retention.
**Where in code:** `client/src/pages/history.jsx` or a new `Profile` section.
**How:** Analyze the fetched `experiments` array. If `score === 100`, render a specific badge icon next to the record.

### 8. Virtual Safety Gear Check — Priority: LOW | Effort: SMALL
**What:** A UI toggle requiring users to "equip safety goggles" before controls unlock.
**Why:** Reinforces real-world lab safety protocols, a prominent educational feature in VR/3D chemistry labs.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add a `safetyGogglesOn` boolean state. Disable the "INITIATE REACTION" button and sliders until the user checks this box.

### 9. Interactive Periodic Table Reference — Priority: LOW | Effort: MEDIUM
**What:** A modal or dedicated page showing an interactive periodic table.
**Why:** A fundamental reference tool included in almost all comprehensive chemistry apps (e.g., Beyond Labz).
**Where in code:** `client/src/components/Navbar.jsx`
**How:** Add a "Reference" link in the navbar that opens a modal containing a CSS grid of elements, fetching basic atomic data from a static JSON file.

### 10. Pre-Lab Knowledge Check Modal — Priority: LOW | Effort: MEDIUM
**What:** A quick 1-2 question multiple choice quiz before starting an experiment.
**Why:** EdTech platforms use pre-labs to ensure students understand the core concepts before playing with the simulation.
**Where in code:** `client/src/pages/organic.jsx`, `client/src/pages/inorganic.jsx`
**How:** Intercept the initial module load with a modal containing a hardcoded question. The user must select the correct answer to dismiss the modal and begin.

## Quick Wins (< 1 day each)
1. **CSV Export for Logs**: Easily implemented using native JS Blobs in `history.jsx`.
2. **Smooth Experiment Reset**: Removing the page reload in `titration.jsx` is a quick state update fix.
3. **Integrated Lab Manual**: Replacing the text hint with an actual collapsible text panel in `organic.jsx`/`inorganic.jsx` takes minimal effort.
