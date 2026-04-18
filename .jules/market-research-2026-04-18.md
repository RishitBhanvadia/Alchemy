# Market Research Report
**App:** A React and Three.js-based web virtual chemistry laboratory featuring an interactive 3D environment, AI tutor, and role-based access for students and teachers.
**Market:** EdTech Virtual Labs / STEM Simulation Software
**Date:** 2026-04-18
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is transitioning from purely sandboxed 3D environments to guided, assessment-driven platforms. While Alchemistry has a strong technical foundation with its React Three Fiber implementation and AI tutor, it currently lacks the structured onboarding and robust teacher analytics found in top-tier products. By implementing targeted improvements such as guided lab tours, CSV data exports for educators, and deeper integration of the AI tutor, Alchemistry can quickly bridge the gap between a technical sandbox and a comprehensive educational tool.

## Competitor Analysis
*   **Labster:** The market leader. Focuses on immersive, narrative-driven 3D simulations. Differentiates with seamless LMS integration, automated grading, and a massive library of specific curriculum-aligned experiments.
*   **PraxiLabs:** Focuses on accessibility and institutional adoption. Differentiates with custom quiz builders, performance analytics tracking every student action, and an AI Lab Assistant ("Oxi") that provides personalized guidance.
*   **PhET Interactive Simulations:** The accessible standard. Focuses on free, easily distributable 2D/3D simulations. Differentiates with extreme accessibility, offline access, and translation into many languages.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Structured Onboarding:** Competitors use guided tours to familiarize users with complex UI/3D controls before allowing free play.
*   **Data Export for Teachers:** Educators expect to be able to download student progress and quiz results for their gradebooks.
*   **Contextual Tooltips:** Explanations for specific lab equipment and chemicals upon hover or first interaction.

### Differentiating Opportunities (Stand-out features)
*   **Proactive AI Guidance:** Rather than waiting for the user to ask a question, the AI could suggest actions or identify mistakes based on current chemical selections.
*   **Customizable Quizzes:** Allowing teachers to define the expected outcomes or questions for a specific lab session.

### UX Patterns (Design/interaction patterns common in top products)
*   **Progress Indicators:** Visual feedback on how far along a student is in a specific experiment protocol.
*   **Split-pane views:** Showing the 3D lab alongside step-by-step instructions or the AI chat.

## Prioritised Recommendations

### 1. Teacher Analytics CSV Export — Priority: HIGH | Effort: SMALL
**What:** Add a button to export the student progress data grid to CSV.
**Why:** Table stakes for any EdTech tool used by teachers. They need data for external gradebooks.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an "Export to CSV" button above the `@tanstack/react-table` that converts the current table data into a CSV string and triggers a download.

### 2. Context-Aware AI Suggestions — Priority: HIGH | Effort: SMALL
**What:** Pass the currently selected chemicals to the AI Tutor to provide contextual greeting/suggestions.
**Why:** PraxiLabs heavily markets its AI assistant. Providing proactive context makes the AI feel like a tutor rather than just a chatbot.
**Where in code:** `client/src/components/AiTutorPanel.jsx`
**How:** Use `useLabStore` state (`chemA`, `chemB`) to generate a dynamic placeholder or initial greeting in the AI chat when opened (e.g., "I see you're working with HCl. Need help predicting the reaction?").

### 3. Lab Onboarding Tour / First-time Overlay — Priority: HIGH | Effort: MEDIUM
**What:** A brief overlay explaining controls (mix, reset, AI) when entering the 3D lab.
**Why:** 3D environments are intimidating. Competitors ensure users know how to interact before starting.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a state `hasSeenTour` in localStorage. If false, render a simple modal or spotlight overlay explaining the "INITIATE REACTION" button and AI toggle.

### 4. Visual Chemical Safety Warnings — Priority: MEDIUM | Effort: SMALL
**What:** Display warning icons next to hazardous chemicals.
**Why:** Safety is a core reason virtual labs exist. Highlighting hazards reinforces safety training.
**Where in code:** `client/src/pages/Lab3D.jsx` (or chemical selection component)
**How:** Add a small tooltip or warning icon (⚠️) next to specific chemicals in the selector based on their properties in `useLabStore`.

### 5. Experiment History Search/Filter — Priority: MEDIUM | Effort: SMALL
**What:** Add a search bar to the student history view.
**Why:** As students complete more experiments, finding specific past results becomes difficult.
**Where in code:** `client/src/pages/history.jsx` (assuming this file handles the history view based on route)
**How:** Add a text input that filters the `historyLogs` array from `useHistoryStore` before mapping them to the UI.

### 6. Quick Reset / Clear Desk Button — Priority: MEDIUM | Effort: SMALL
**What:** A distinct button to clear selected chemicals without waiting for a reaction to finish.
**Why:** Users often make mistakes in selection and need a fast way to start over, a common pattern in PhET sims.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add a "Clear Selection" button next to "INITIATE REACTION" that calls `useLabStore.getState().reset()`.

### 7. Teacher View: Student Detail Modal — Priority: MEDIUM | Effort: MEDIUM
**What:** Clicking a student row in the teacher dashboard shows their specific experiment history.
**Why:** Teachers need to drill down into *why* a student has a certain score, not just the total XP.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an `onClick` handler to the table rows that opens a modal fetching and displaying that specific `student_id`'s logs from Supabase.

### 8. Loading State Placeholders (Skeleton) for AI — Priority: LOW | Effort: SMALL
**What:** Show a typing indicator or skeleton loader in the AI chat while waiting for the API.
**Why:** Improves perceived performance and matches standard AI chat UX.
**Where in code:** `client/src/components/AiTutorPanel.jsx`
**How:** Add a simple pulsing CSS animation element in the message list when `isLoading` is true.

### 9. Shareable "Success" Results — Priority: LOW | Effort: SMALL
**What:** Allow students to copy a summary of a successful reaction to their clipboard.
**Why:** Encourages engagement and allows easy pasting into external lab reports.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Add a "Copy Result" button that writes a formatted string (e.g., "I successfully synthesized...") to `navigator.clipboard`.

### 10. Split View Toggle for Lab/Chat — Priority: LOW | Effort: MEDIUM
**What:** Option to dock the AI panel side-by-side with the 3D canvas instead of floating over it.
**Why:** Prevents the AI panel from obscuring the experiment, a common issue in single-screen setups.
**Where in code:** `client/src/pages/Lab3D.jsx` & `client/src/components/AiTutorPanel.jsx`
**How:** Add a "dock" toggle state that changes the CSS layout of `Lab3D.jsx` from a relative full-width canvas to a CSS grid (e.g., 70% canvas / 30% chat).

## Quick Wins (< 1 day each)
1. **Teacher Analytics CSV Export:** Can be implemented using standard browser Blob/URL APIs in a few hours.
2. **Context-Aware AI Suggestions:** Simple UI tweak reading existing state.
3. **Loading State Placeholders for AI:** Just adding a CSS class/element during the existing loading state.