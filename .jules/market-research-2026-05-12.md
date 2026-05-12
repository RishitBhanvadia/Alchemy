# Market Research Report
**App:** Alchemistry is a web-based interactive 3D virtual chemistry laboratory for education, allowing students to conduct experiments and teachers to manage classrooms.
**Market:** EdTech / Virtual Science Laboratory Software
**Date:** 2026-05-12
**Competitors Researched:** PraxiLabs, Labster

## Executive Summary
The virtual chemistry laboratory market is focused on providing safe, accessible, and highly educational alternatives to physical labs. Top competitors differentiate themselves not just through 3D simulations, but by embedding pedagogical tools directly into the workflow—such as integrated quizzes, real-world problem solving, and AI assistance. Alchemistry already has a strong 3D foundation and AI tutor, but misses the mark on built-in knowledge assessments during the lab experience. The biggest opportunity is to integrate quizzes into the existing experiment flow to validate student learning.

## Competitor Analysis
- **PraxiLabs:** Features gamified simulations with a strong emphasis on instant reporting, built-in question banks, custom quiz builders, and an AI lab assistant.
- **Labster:** Focuses on immersive, inquiry-based learning where students solve real-case problems (e.g., acidic lake contamination). They heavily utilize quiz questions to test knowledge and support deep learning.

## Gap Analysis
### Table Stakes (Expected by users, missing from app)
- **In-Experiment Quizzes:** Users expect to be tested on the concepts they are exploring while in the virtual lab.
- **Real-World Scenarios:** framing experiments around real-world problems rather than just abstract chemical mixing.

### Differentiating Opportunities (Stand-out features)
- **AI-Powered Formative Assessment:** Using the existing AI infrastructure to generate context-aware questions.

### UX Patterns (Design/interaction patterns common in top products)
- **Post-Reaction Review:** Modal or panel that immediately follows a reaction, asking the student to interpret the results before moving on.

## Prioritised Recommendations

### 1. Interactive Quizzes in Result Modal — Priority: HIGH | Effort: MEDIUM
**What:** Add a mandatory or optional quiz component that appears when an experiment finishes.
**Why:** Both PraxiLabs and Labster use integrated quizzes to verify student understanding and improve retention rates. It transforms a "sandbox" into a structured learning tool.
**Where in code:** `client/src/components/ResultModal.jsx`
**How:** Extend `ResultModal.jsx` to fetch or display a set of multiple-choice questions based on the `reactionResult`. Add state to track quiz completion before allowing the student to close the modal or reset the lab.

### 2. Scenario-Based Assignments — Priority: MEDIUM | Effort: SMALL
**What:** Update the assignment system to use narrative-driven scenarios instead of just target scores or chemical names.
**Why:** Labster's "solve an acidic lake contamination" is more engaging than "mix acid and base".
**Where in code:** `server/routes/assignments.js` (or similar DB seeding) and `client/src/pages/StudentDashboard.jsx`
**How:** Update the database schema or seed data to include a `scenario_description` field for assignments, and display this narrative prominently in the `StudentDashboard` assignment cards.

## Quick Wins (< 1 day each)
1. **Add Quiz UI to ResultModal:** Hardcode 1-2 basic questions in `ResultModal.jsx` as a proof-of-concept for the quiz feature.
2. **Update Assignment UI:** Tweak the assignment cards in `StudentDashboard.jsx` to emphasize the "mission" or "goal" of the experiment.