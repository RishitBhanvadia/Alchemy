# Market Research Report
**App:** Alchemistry is a web-based 3D virtual chemistry laboratory allowing students to safely conduct interactive experiments and track results.
**Market:** Educational Technology (EdTech) / Virtual STEM Labs
**Date:** 2024-05-14
**Competitors Researched:** Labster, PraxiLabs

## Executive Summary
The virtual chemistry lab space is currently dominated by platforms like Labster and PraxiLabs. The standard for top products includes robust 3D interactive environments, a heavy focus on student safety/protocol training, custom-built assessments, and immediate contextual feedback via AI or guided learning paths. While Alchemistry has a solid 3D lab environment and AI Tutor integration, it falls behind competitors in guided pre-experiment safety protocols, structured contextual feedback during experiments, and robust classroom management/quiz features that give teachers more granular control over learning outcomes.

## Competitor Analysis
*   **Labster:** Focuses on immersive, narrative-driven simulations. Key differentiators include "escape room" style safety training, extensive curriculum matching, and high-fidelity 3D practice scenarios (e.g., balancing equations, identifying properties).
*   **PraxiLabs:** Focuses on realistic 3D labs with a "game-like" experience. Key differentiators include an AI Lab Assistant ("Oxi") for real-time guidance, a custom quiz builder linked to experiments, comprehensive performance analytics, and a strong emphasis on risk-free organic/inorganic/analytical chemistry simulations.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Guided Onboarding / Lab Manuals:** Step-by-step instructions overlaid on the 3D environment to guide students through their first experiments.
*   **Safety Protocols Check:** A mandatory safety checklist (e.g., putting on virtual goggles/gloves) before starting an experiment.

### Differentiating Opportunities (Stand-out features)
*   **Interactive Quizzing:** Embedding quick knowledge-check quizzes immediately after a reaction completes to reinforce learning.
*   **Exportable Lab Reports:** Allowing students to export their experiment logs as formatted PDFs to submit to teachers.

### UX Patterns (Design/interaction patterns common in top products)
*   **Contextual Hints:** Floating hints or a "lab partner" overlay that nudges the user if they mix the wrong chemicals repeatedly.
*   **Progress Indicators:** A visual checklist of steps required to complete an assigned experiment module.

## Prioritised Recommendations

### 1. Pre-Experiment Safety Checklist — Priority: HIGH | Effort: SMALL
**What:** A mandatory modal prompting the user to acknowledge virtual safety protocols (goggles, gloves, ventilation) before the 3D lab controls unlock.
**Why:** Safety training is a core feature in Labster and PraxiLabs. It reinforces real-world lab habits.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `SafetyChecklistModal` component that sets a `hasPassedSafety` state to `true` upon completion, which then enables the "INITIATE REACTION" button and sliders.

### 2. Exportable Lab Reports — Priority: HIGH | Effort: MEDIUM
**What:** A feature to export the user's experiment history or specific results to a PDF or CSV file.
**Why:** Essential for educational environments so students can submit work to teachers. Standard in top competitor tools.
**Where in code:** `client/src/pages/history.jsx` and `client/src/pages/result.jsx`
**How:** Add an `ExportButton` component utilizing a library like `jspdf` or `papaparse` to format the data stored in the `cart` localStorage or `logs` state into a downloadable file.

### 3. Step-by-Step Guided Tutorial — Priority: MEDIUM | Effort: MEDIUM
**What:** A guided tour for first-time users in the 3D Lab, highlighting controls and explaining the UI.
**Why:** Lowers the barrier to entry and matches the guided experience seen in PraxiLabs and Labster.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Implement a lightweight guided tour library (e.g., `react-joyride`) or custom overlay tooltips controlled by a `hasSeenTutorial` flag in `localStorage`.

### 4. In-Experiment Progress Checklist — Priority: MEDIUM | Effort: SMALL
**What:** A visual checklist showing the steps required to complete a specific assignment (e.g., "Mix 50% HCl", "Observe Reaction").
**Why:** Gamifies the experience and provides clear direction, a highly rated feature in PraxiLabs.
**Where in code:** `client/src/pages/Lab3D.jsx` (and integration with `AssignmentStore`)
**How:** Add a floating `TaskChecklist` component that updates as the user interacts with the sliders and initiates the reaction, reading target goals from the assigned experiment data.

### 5. Contextual "Lab Partner" Hints — Priority: MEDIUM | Effort: MEDIUM
**What:** Proactive hints from the existing AI Tutor when a student struggles or mixes non-reactive chemicals.
**Why:** Enhances the existing AI Tutor by making it proactive rather than just reactive, similar to PraxiLabs' "Oxi".
**Where in code:** `client/src/pages/Lab3D.jsx` and `client/src/components/AiTutorPanel.jsx`
**How:** Monitor the `reactionState` and user inputs. If multiple "No Reaction" results occur, trigger a subtle animation on the AI toggle button and pre-fill a suggested hint in the `AiTutorPanel`.

### 6. Post-Reaction Quick Quiz — Priority: LOW | Effort: MEDIUM
**What:** A quick 1-2 question popup checking the student's understanding of the reaction that just occurred.
**Why:** Solidifies learning outcomes and provides more granular data for teacher analytics.
**Where in code:** `client/src/components/ResultModal.jsx` or `client/src/pages/result.jsx`
**How:** Add a `QuickQuiz` component that pulls relevant questions based on the `reactionResult` before allowing the user to return to the lab.

### 7. Interactive Chemical Properties Tooltips — Priority: LOW | Effort: SMALL
**What:** Hover-over tooltips on the chemical icons in the lab that display basic properties (e.g., molar mass, state).
**Why:** Provides on-demand learning without navigating away from the lab space.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add `title` attributes or custom floating tooltips to the `.chem-name` and `.chem-formula` elements in the slider cards.

### 8. Teacher View: Real-time Student Status — Priority: LOW | Effort: LARGE
**What:** A dashboard view for teachers showing which students are currently in the lab and what they are mixing.
**Why:** Mirrors the "100% All-Time Supervision" feature touted by PraxiLabs.
**Where in code:** `client/src/pages/TeacherDashboard.jsx` and Supabase realtime subscriptions
**How:** Use Supabase real-time presence or broadcasting to broadcast student lab states to the teacher dashboard.

### 9. Shareable "Experiment Replay" Links — Priority: LOW | Effort: LARGE
**What:** Allow users to share a link that replays a specific experiment outcome.
**Why:** Encourages collaboration and allows teachers to demonstrate specific reactions easily.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Encode chemical concentrations in the URL parameters (e.g., `?hcl=50&nacl=50`) and read these on load to pre-fill the lab state.

### 10. Granular "Mistake" Logging — Priority: LOW | Effort: SMALL
**What:** Specifically logging failed reactions or incorrect mixtures, not just successful ones.
**Why:** Provides better data for teachers to identify where students are struggling.
**Where in code:** `client/src/pages/Lab3D.jsx` (Reaction API call)
**How:** Ensure the API and `experiment_results` table record entries even when the `outcome_label` indicates a failed or invalid reaction.

## Quick Wins (< 1 day each)
1.  **Pre-Experiment Safety Checklist:** Easily implemented with a simple modal component and local state in `Lab3D.jsx`.
2.  **Interactive Chemical Properties Tooltips:** Can be added quickly using standard HTML `title` attributes or a simple CSS tooltip.
3.  **Exportable Lab Reports:** Implementing a basic CSV export using `papaparse` on the existing `logs` or `cart` data is straightforward.
