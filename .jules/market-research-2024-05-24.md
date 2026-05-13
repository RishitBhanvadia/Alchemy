# Market Research Report
**App:** Alchemistry is a web-based virtual chemistry laboratory using 3D simulations (React + Three.js) to provide interactive, safe, and trackable chemistry experiments for students and teachers.
**Market:** EdTech / Virtual Science Simulators
**Date:** 2024-05-24
**Competitors Researched:** Labster, PraxiLabs, ChemCollective

## Executive Summary
The virtual chemistry simulator market is dominated by comprehensive, gamified 3D platforms targeting universities and high schools. Key competitors emphasize not just the simulations themselves, but also deep LMS integration, guided learning paths, built-in assessments, and analytics dashboards. While Alchemistry has a solid foundation with its 3D environment and AI tutor, it can better compete by enhancing curriculum alignment (pre/post-lab quizzes), adding more contextual guidance, and improving instructor tools.

## Competitor Analysis
- **Labster:** The market leader, offering highly immersive 3D labs often integrated with VR. Known for real-world scenarios, gamified storytelling, built-in quizzes, and strong efficacy research. Differentiator: Immersion and comprehensive curriculum alignment.
- **PraxiLabs:** A strong 3D alternative focusing on accessibility, cost-effectiveness, and LMS integration. Offers a custom quiz builder and an AI lab assistant ("Oxi"). Differentiator: Multilingual support and strong institutional tools.
- **ChemCollective:** An older, open-educational platform. While lacking modern 3D graphics (mostly 2D interfaces), it provides rigorous, calculation-heavy virtual labs, scenario-based learning, and autograded problems. Differentiator: Free, heavily academic focus on core chemistry calculations (stoichiometry, kinetics).

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **Built-in Quizzes/Assessments:** Competitors seamlessly integrate quizzes before, during, or after experiments. Alchemistry currently relies on basic assignments without integrated in-lab questioning.
- **LMS Integration:** While perhaps a larger effort, it is standard for institutional adoption.
- **Pre-lab and Post-lab Exercises:** Guided preparation and reflection phases.

### Differentiating Opportunities (Stand-out features)
- **Scenario-Based Learning:** Framing experiments within real-world problems (like Labster or ChemCollective) instead of just mixing chemicals.
- **Customizable Quiz Builder:** Allowing teachers to build specific assessments tied to the 3D lab (like PraxiLabs).

### UX Patterns (Design/interaction patterns common in top products)
- **Guided Onboarding/Step-by-step UI:** Clear, step-by-step instructions overlaid on the 3D view.
- **In-Lab Knowledge Checks:** Small popups asking questions before allowing the next step.
- **Detailed Analytics Dashboard:** Showing time spent, mistakes made, and quiz scores.

## Prioritised Recommendations

### 1. In-Lab Knowledge Checks (Micro-Quizzes) — Priority: HIGH | Effort: MEDIUM
**What:** Add small, contextual quiz popups during the experiment (e.g., "What state change do you expect?") that must be answered to proceed or unlock chemicals.
**Why:** Competitors (Labster, PraxiLabs) use active recall during simulations to improve retention (up to 80% reported).
**Where in code:** `client/src/pages/Lab3D.jsx`, `client/src/store/labStore.js`
**How:** Extend `labStore` to hold a `currentQuiz` state. When certain chemical combinations are selected, trigger a modal (`<KnowledgeCheckModal />`) before the `initiateReaction` completes.

### 2. Guided Experiment Scenarios — Priority: HIGH | Effort: MEDIUM
**What:** Introduce "Scenario Mode" where students follow a specific narrative (e.g., "Neutralize the toxic spill") rather than just open sandbox play.
**Why:** Labster's success is heavily tied to gamified, real-world storytelling, which increases engagement.
**Where in code:** `client/src/pages/StudentDashboard.jsx`, new `ScenarioList.jsx`
**How:** Add a new module card in `StudentDashboard` for "Scenarios". Create a configuration file (`scenarios.json`) that pre-loads specific chemicals and provides a narrative panel next to the `Lab3D` canvas.

### 3. Comprehensive Teacher Analytics Export — Priority: MEDIUM | Effort: SMALL
**What:** Allow teachers to export student experiment history and scores to CSV.
**Why:** Essential for institutions. All competitors offer robust reporting.
**Where in code:** `client/src/pages/TeacherDashboard.jsx`
**How:** Add an "Export to CSV" button in the TeacherDashboard that maps the `experimentScores` table data to a CSV using a lightweight utility or raw JS blob creation.

### 4. Interactive Pre-Lab Theory Tooltips — Priority: MEDIUM | Effort: SMALL
**What:** Add informational tooltips (hover/click) to the chemical sliders in the 3D lab explaining their properties (e.g., pH, hazards).
**Why:** PraxiLabs and ChemCollective emphasize theory before practice.
**Where in code:** `client/src/pages/Lab3D.jsx`
**How:** Add an "info" icon (`ⓘ`) next to chemical names in the `slider-header` that toggles a small floating div with chemical details.

### 5. Proactive AI Tutor Prompts — Priority: LOW | Effort: MEDIUM
**What:** Instead of waiting for the user to click the AI tutor, have the tutor offer a specific contextual prompt after a failed/neutral reaction.
**Why:** PraxiLabs promotes their "Oxi" assistant as proactive.
**Where in code:** `client/src/pages/Lab3D.jsx`, `client/src/components/AiTutorPanel.jsx`
**How:** Watch the `reactionResult` state. If it's a generic "Mixing" or error, trigger a small notification: "Need help figuring out what went wrong? Ask AI!" that opens the panel.

## Quick Wins (< 1 day each)
1. **Interactive Pre-Lab Theory Tooltips:** Easy UI addition in `Lab3D.jsx`.
2. **Comprehensive Teacher Analytics Export:** Simple CSV generation function in `TeacherDashboard.jsx`.
3. **Proactive AI Tutor Prompts:** Simple state trigger in `Lab3D.jsx` based on reaction outcomes.
