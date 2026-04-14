# Market Research Report
**App:** Alchemistry
**Market:** Virtual Chemistry Lab Software for STEM Education
**Date:** 2023-10-24
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual chemistry lab market is characterized by interactive simulations designed to enhance student understanding and engagement in STEM fields. Top platforms emphasize curriculum alignment, student tracking for educators, and realistic 3D environments. Alchemistry is well-positioned with its 3D canvas and AI tutor. However, it lacks robust exporting features and deep LMS integration, which are standard in competitors like Labster and PraxiLabs. By adding a CSV export to the experiment history and improving in-lab tools like calculators and real-time guidance, Alchemistry can better compete in this space.

## Competitor Analysis
*   **Labster:** A giant in the space, offering over 300 highly realistic 3D simulations. It integrates heavily with LMS (Learning Management Systems) and provides admin-level dashboards and automated grading. Its main differentiator is its vast library and enterprise-level features.
*   **PraxiLabs:** Focuses on realistic 3D virtual science labs with an AI lab assistant ("OXI"). It excels in providing step-by-step guided experiments, quiz builders, and detailed performance analytics to track student progress.
*   **PhET Interactive Simulations:** Provides free, highly accessible interactive math and science simulations. While less visually realistic (often 2D or simplified 3D), it is widely used due to its pedagogical effectiveness and ease of access.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
*   **Data Export (CSV):** Students and teachers need to export experiment data for external analysis or grading.
*   **Built-in Calculator/Notebook:** Students need in-app tools to perform calculations or take notes during complex titrations or reactions without leaving the 3D environment.

### Differentiating Opportunities (Stand-out features)
*   **Real-time Guidance/AI Assistant (Enhancement):** Alchemistry has an AI Tutor, but it could be more context-aware, similar to PraxiLabs' "OXI", providing real-time hints based on the *exact* step the student is on.
*   **Assessment Tools (Quiz Builder):** Allowing teachers to attach quizzes directly to experiments.

### UX Patterns (Design/interaction patterns common in top products)
*   **Step-by-step progress tracking:** A visual indicator of where the student is in a multi-step experiment.

## Prioritized Recommendations

### 1. CSV Export for Experiment History — Priority: HIGH | Effort: SMALL
**What:** Add a "Download CSV" button to the History page to export past experiments.
**Why:** Standard expectation for lab software; students need to include data in lab reports, and teachers need it for grading.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add a button that maps the `logs` array from `useHistoryStore` to a CSV string and triggers a file download.

### 2. Built-in Lab Calculator/Notebook — Priority: MEDIUM | Effort: MEDIUM
**What:** A draggable, resizable overlay panel in the 3D Lab containing a simple calculator and text area for notes.
**Why:** Reduces context switching. Students currently have to use external tools while performing titrations or complex reactions.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a new `LabToolsPanel` component and toggle its visibility from the main Lab3D UI, similar to how `AiTutorPanel` is handled.

### 3. Context-Aware AI Guidance Prompts — Priority: HIGH | Effort: MEDIUM
**What:** Enhance the AI Tutor to proactively offer hints based on the `reactionState` or inactive time.
**Why:** Competitors like PraxiLabs use real-time guidance effectively. Currently, the AI tutor seems reactive (user has to ask).
**Where in code:** `client/src/store/labStore.js` and `client/src/components/AiTutorPanel.jsx`
**How:** Monitor `reactionState` and if a student is stuck for > X seconds, trigger a small pulse animation on the AI tutor button and offer a context-specific hint.

## Quick Wins (< 1 day each)
1.  **CSV Export in History Page:** Easy to implement using vanilla JS or a small library like Papa Parse.
2.  **Clear History Button:** Allow users to clear their experiment history for a fresh start.
3.  **Loading State Polish:** Add a skeleton loader for the History table while logs are fetching to improve perceived performance.
