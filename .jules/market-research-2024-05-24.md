# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory using React and Three.js that enables students to conduct safe, interactive 3D experiments with AI tutoring.
**Market:** Educational Technology (EdTech) / Virtual Science Laboratory Simulations
**Date:** 2024-05-24
**Competitors Researched:** ChemCollective, Labster, PraxiLabs, Beyond Labz

## Executive Summary
The virtual chemistry lab market is dominated by platforms focusing on realistic simulations, educational scaffolding, and seamless integration into school curricula. Top competitors combine open-ended exploration with structured, guided learning paths (like quizzes and worksheets) and robust educator tools (LMS integration, performance tracking). Alchemistry has a strong technical foundation with its interactive 3D environments, real-time physics, and unique Gemini-powered AI Tutor. However, to compete effectively, it needs stronger structured learning elements (exportable lab notebooks, in-simulation quizzes) and more detailed environmental feedback (like pH and temperature readouts) that users expect in this space.

## Competitor Analysis
*   **ChemCollective:** A veteran in the space. Very focused on "authentic laboratory chemistry" and quantitative analysis. Known for open-ended problem solving and "Predict and Check" homework modes, though the UI is dated.
*   **Labster:** The market leader in high-fidelity 3D simulations. Highly gamified with storylines, quiz questions integrated directly into the 3D environment, and strong focus on student engagement.
*   **PraxiLabs:** Focuses on immersive 3D labs with a built-in AI assistant ("Oxi"). Strong features include bilingual support, custom quiz builders for teachers, and detailed performance analytics.
*   **Beyond Labz:** Excels at offering both completely open-ended experimentation and guided activities. Known for realistic outcomes (allowing students to learn from mistakes) and comprehensive lab books for recording data.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Exportable Lab Notebooks:** Competitors provide built-in ways for students to record procedures, data, and submit results. Alchemistry lacks a persistent, exportable notebook.
*   **Detailed Solution Info Viewer:** Users expect to see exact pH, temperature, and state (aqueous, solid, gas) dynamically. Alchemistry currently relies mostly on visual feedback and basic outcomes.
*   **Guided Assessment/Quizzes:** Competitors integrate auto-graded quizzes within the lab to test understanding of the current experiment.

### Differentiating Opportunities (Stand-out features)
*   **AI Tutor Proactive Guidance:** While Alchemistry has an AI Tutor (Gemini), it requires manual invocation. Products like PraxiLabs use their AI assistant to offer proactive, real-time guidance when a student is stuck.
*   **"Predict and Check" Mode:** Before running a reaction, asking the student to predict the outcome and comparing it to the actual result.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Tooltips on First Use:** High-quality onboarding that walks through the complex UI step-by-step.
*   **Real-time Educator Analytics Dashboard:** Teachers can see live progress of students in a session, not just after completion.

## Prioritised Recommendations

### 1. Interactive Lab Notebook — Priority: HIGH | Effort: MEDIUM
**What:** Add a persistent "Lab Notebook" panel where students can write observations and click to automatically log the current chemical state (e.g., HCl: 50%, NaOH: 50%).
**Why:** Standard across all major competitors (Beyond Labz, ChemCollective) to bridge simulation and actual scientific method practice.
**Where in code:** Create `client/src/components/LabNotebook.jsx` and integrate it into `client/src/pages/Lab3D.jsx` alongside the AI Tutor panel.
**How:** Build a slide-out panel with a textarea. Add a "Log Current State" button that appends the current `chemA`, `chemB`, etc., from `useLabStore` into the text.

### 2. Contextual First-Time Onboarding — Priority: HIGH | Effort: SMALL
**What:** Implement a guided tour for the 3D lab interface on first visit.
**Why:** The interface is complex (3D canvas + multiple sliders). Top competitors use step-by-step tooltips to reduce cognitive load.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/store/labStore.js`.
**How:** Add a `hasSeenOnboarding` boolean to localStorage/zustand. If false, render a simple overlay that highlights the chemical sliders, the 'Initiate Reaction' button, and the AI Tutor button sequentially.

### 3. Solution Properties Dashboard (pH & Temp) — Priority: MEDIUM | Effort: SMALL
**What:** Display estimated pH and temperature of the mixture in real-time or post-reaction.
**Why:** ChemCollective and Labster provide quantitative data for analysis, making the simulation viable for higher education.
**Where in code:** `client/src/components/ResultModal.jsx` and backend `server/routes/resultRoutes.js`.
**How:** Modify the backend reaction logic to return approximate pH and temperature values in the `res.data`. Update `ResultModal.jsx` to display these metrics visually alongside the existing outcome string.

### 4. "Predict Outcome" Pre-Reaction Check — Priority: MEDIUM | Effort: MEDIUM
**What:** Before the reaction animation plays, prompt the user to predict what will happen (e.g., color change, gas, precipitate).
**Why:** "Predict and check" is a highly praised educational pattern used by ChemCollective to ensure students aren't just blindly mixing chemicals.
**Where in code:** `client/src/pages/Lab3D.jsx` (`handlePlayClick` function).
**How:** Intercept `handlePlayClick`. Show a small modal asking "What do you expect to happen?" with a few multiple-choice options (derived from the AI or hardcoded). Once answered, proceed with the API call and 3D reaction.

### 5. Proactive AI Tutor Hints — Priority: LOW | Effort: SMALL
**What:** Automatically pop open the AI Tutor with a hint if a student sits idle for >2 minutes with unreacted chemicals.
**Why:** PraxiLabs heavily markets their proactive AI assistant. It prevents student frustration.
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/AiTutorPanel.jsx`.
**How:** Add an inactivity timer in `Lab3D.jsx` that resets on mouse movement/slider change. If it hits 2 mins, call the `/api/ai/hint` endpoint and auto-open `AiTutorPanel` with the response.

## Quick Wins (< 1 day each)
1.  **Contextual First-Time Onboarding:** Can be built quickly using basic CSS overlays and a local storage flag.
2.  **Solution Properties Dashboard:** Minor update to the backend reaction payload and frontend result modal.
3.  **Proactive AI Tutor Hints:** Just a simple `setTimeout` added to the existing Lab3D component that triggers the already-built AI panel.