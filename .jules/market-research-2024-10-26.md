# Market Research Report
**App:** A cutting-edge web-based virtual chemistry laboratory enabling students to conduct safe, interactive chemistry experiments in a 3D environment.
**Market:** EdTech Virtual Science Laboratory
**Date:** 2024-10-26
**Competitors Researched:** PraxiLabs, Labster, ChemCollective

## Executive Summary
The virtual science laboratory market is highly focused on risk-free, immersive experiences that mimic physical labs while providing guided learning. Top competitors like PraxiLabs and Labster differentiate themselves with structured onboarding, real-time conversational AI tutors, and comprehensive assessment tools. While Alchemistry has a strong 3D foundation and basic AI hints, it currently lacks the structured guidance (like pre-lab safety checks and step-by-step walkthroughs) and post-experiment analysis tools (like CSV exports) expected in mature platforms. Bridging these gaps will significantly enhance its educational value and classroom readiness.

## Competitor Analysis
- **PraxiLabs:** Offers over 186 interactive experiments across Chemistry, Physics, and Biology. Key differentiators include an AI lab assistant ("Oxi") capable of conversational learning, structured tutorials/guided learning without prior training, and instant MCQ assessments post-experiment.
- **Labster:** Known for highly gamified, story-driven simulations with strong emphasis on pre-lab safety protocols and conceptual quizzes integrated seamlessly into the 3D environment.
- **ChemCollective:** A free, NSF-sponsored 2D virtual lab. Its main strength lies in its extensive library of specific chemical scenarios and multi-language support, though it lacks the modern 3D immersion of Alchemistry.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- Pre-lab safety checks and PPE acknowledgment before starting experiments.
- Ability to export experiment logs/history for grading or external analysis.
- Visual hazard warnings on chemical containers/sliders.

### Differentiating Opportunities (Stand-out features)
- Structured, step-by-step guided walkthroughs for specific curricular experiments.
- Post-experiment formative assessments (MCQs) to verify conceptual understanding.
- Context-aware conversational AI that references the student's past failed attempts.

### UX Patterns (Design/interaction patterns common in top products)
- Persistent experiment milestones allowing students to resume without starting over.
- Ability to pin/bookmark significant experiment results in the history view.
- Explicit visual feedback for lab instrument interactions (e.g., precise buret drop rates).

## Prioritised Recommendations

### 1. Pre-Lab Safety Acknowledgment — Priority: HIGH | Effort: SMALL
**What:** A mandatory safety check modal (PPE, hazard awareness) before students can interact with the lab.
**Why:** Table stakes for virtual labs to simulate real-world protocols and build good habits.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Create a `PreLabCheckModal` component that blocks the 3D canvas interaction until the user checks off safety requirements. Store completion state in `sessionStorage`.

### 2. Export Experiment History to CSV — Priority: HIGH | Effort: SMALL
**What:** Allow students to download their experiment logs as a CSV file.
**Why:** Essential for teachers assigning lab reports and students documenting their work.
**Where in code:** `client/src/pages/history.jsx`
**How:** Add an `ExportButton` component that maps the `logs` state from `useHistoryStore` to a CSV format and triggers a file download using standard browser Blob APIs.

### 3. Guided Experiment Mode — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step tutorial overlay that guides users through a specific reaction.
**Why:** Prevents cognitive overload for new students and aligns with PraxiLabs' highly successful guided learning approach.
**Where in code:** `client/src/store/labStore.js` and `client/src/pages/Lab3D.jsx`
**How:** Add a `guidedStep` state in the store. In `Lab3D.jsx`, display a sequence of instructions (e.g., "Set HCl to 50%") and disable the "Initiate Reaction" button until the specific condition is met.

### 4. Post-Experiment Assessment Quiz — Priority: MEDIUM | Effort: MEDIUM
**What:** A brief multiple-choice question presented upon a successful reaction.
**Why:** Reinforces learning objectives and provides actionable data on student comprehension.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Extend `ResultModal.jsx` to fetch and display a context-relevant MCQ before allowing the student to reset the lab.

### 5. Visual Hazard Indicators — Priority: MEDIUM | Effort: SMALL
**What:** Standard hazard icons (e.g., corrosive, toxic) displayed next to chemical names.
**Why:** Improves realism and reinforces chemical safety knowledge.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add simple inline SVG icons to the `.label-group` in each `.slider-card` based on the chemical type.

### 6. Conversational AI Context — Priority: MEDIUM | Effort: MEDIUM
**What:** Pass recent failed experiments as context to the AI tutor.
**Why:** Upgrades the AI from generic hints to a personalized tutor (similar to PraxiLabs' "Oxi").
**Where in code:** `client/src/components/AiTutorPanel.jsx`
**How:** Inject the last 3 items from `useHistoryStore` into the prompt sent to the backend `/api/ai/chat` endpoint.

### 7. Experiment Bookmarking — Priority: LOW | Effort: SMALL
**What:** Ability to "star" or bookmark specific experiment results.
**Why:** Helps students easily find important reactions for their lab reports.
**Where in code:** `client/src/pages/history.jsx` and Supabase schema
**How:** Add an `is_favorite` boolean to the `experiment_logs` table. Add a star toggle icon to each log item in `History.jsx`.

### 8. Session Persistence for Milestones — Priority: LOW | Effort: SMALL
**What:** Save current slider values so a page refresh doesn't reset the lab.
**Why:** Improves user experience by preventing lost progress during accidental navigation.
**Where in code:** `client/src/store/labStore.js`
**How:** Use Zustand's `persist` middleware to save `chemA`, `chemB`, `chemI`, and `chemC` states to `localStorage`.

### 9. Precision Drop Rate Control — Priority: LOW | Effort: MEDIUM
**What:** A secondary control for fine-tuning chemical additions (e.g., +/- 1% buttons).
**Why:** Sliders are often too coarse for precise experiments like titrations.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add small "+" and "-" button controls next to each range input to increment/decrement values exactly by 1.

### 10. Dashboard Quick Stats — Priority: LOW | Effort: SMALL
**What:** Show total successful reactions vs total attempts on the dashboard.
**Why:** Gamifies the experience and gives students an immediate sense of progress.
**Where in code:** `client/src/pages/StudentDashboard.jsx`
**How:** Compute success rate from `logs` in `useHistoryStore` and render a small stat widget in the "Recent Experiments" section.

## Quick Wins (< 1 day each)
1. **Pre-Lab Safety Acknowledgment:** Just a UI modal blocking interaction until clicked; builds immediate educational credibility.
2. **Export Experiment History to CSV:** Simple array-to-string mapping and Blob download in the frontend.
3. **Visual Hazard Indicators:** Purely frontend visual enhancement that adds immediate realism.
