# Market Research Report
**App:** Alchemistry - Virtual 3D Chemistry Laboratory
**Market:** EdTech / Virtual Science Labs (High School & Higher Ed)
**Date:** 2024-05-22
**Competitors Researched:** Labster, PraxiLabs, PhET Interactive Simulations

## Executive Summary
The virtual science lab market is dominated by comprehensive platforms like **Labster** and **PraxiLabs** that prioritize "safety" and "instructor analytics" alongside high-fidelity simulations. **Alchemistry** has a strong technical foundation with 3D simulations (React Three Fiber) but lacks the educational scaffolding required to compete as a learning tool. The biggest opportunity is to wrap the existing simulations with guided onboarding, safety protocols, and post-lab assessments to transform it from a "simulator" to a "lab course".

## Competitor Analysis

### 1. Labster (Market Leader)
- **Strengths:** Immersive 3D environments, gamified storytelling, extensive library (300+ labs), LMS integration.
- **Key Feature:** "Dr. One" (AI drone assistant) guides students.
- **Differentiator:** Unbreakable equipment & safety focus.

### 2. PraxiLabs (Strong Contender)
- **Strengths:** Dual language (En/Ar), specialized experiments, "Oxi" AI assistant.
- **Key Feature:** Performance analytics tracking every student click.
- **Differentiator:** Focus on higher-ed/university level experiments.

### 3. PhET Interactive Simulations (Mass Market)
- **Strengths:** Free, accessible (HTML5), concept-focused, no login required.
- **Key Feature:** highly interactive 2D models focusing on specific concepts (e.g., balancing equations).
- **Differentiator:** Simplicity and pedagogical focus over realism.

## Gap Analysis

### Table Stakes (Expected by users, missing from app)
- **Onboarding/Tutorials:** Competitors guide users step-by-step. Alchemistry drops users directly into the lab with no instruction.
- **Safety Protocols:** A core value prop of virtual labs is "safe learning". Alchemistry lacks pre-lab safety checks (PPE, warnings).
- **Unified Progress Tracking:** Titration saves results, but the main Lab (Inorganic) does not. Competitors track *all* activity.

### Differentiating Opportunities
- **3D React Integration:** Most competitors use Unity/WebGL builds that are heavy. Alchemistry's React Three Fiber approach is lightweight and modern.
- **Customizable Chemical Rack:** The slider-based mixing in `Lab.jsx` is unique but needs better visualization of "what's happening".

### UX Patterns
- **"Assistant" Persona:** Competitors use a character (Drone, Robot) to provide hints. Alchemistry could use a simple "Lab Partner" modal.
- **Notebook/Journal:** Users expect to record observations during the experiment, not just see a final result.

## Prioritised Recommendations

### 1. Interactive Onboarding Tour — Priority: HIGH | Effort: MEDIUM
**What:** A step-by-step guided tour for first-time users in `Lab.jsx`.
**Why:** Users currently face a "blank canvas" with no direction. Competitors like Labster hand-hold the first experiment.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Implement a library like `react-joyride` or a custom overlay that highlights the "Chemical Rack", "Test Tube", and "Initiate" button sequentially.

### 2. Pre-Lab Safety Check Modal — Priority: HIGH | Effort: LOW
**What:** A mandatory "Safety Check" popup before starting any experiment.
**Why:** Reinforces the "Lab" context and safety education. Standard in PraxiLabs.
**Where in code:** `client/src/pages/lab.jsx` (and others)
**How:** Create a `SafetyModal` component that requires users to click "Put on Goggles" and "Check Ventilation" before the lab controls become active.

### 3. Unified Experiment History — Priority: HIGH | Effort: MEDIUM
**What:** Ensure *all* experiments (Inorganic, Organic) save results to Supabase, not just Titration.
**Why:** The `History` page is currently incomplete. Teachers need a full log of student activity.
**Where in code:** `client/src/pages/result.jsx`, `server/controllers/resultController.js`
**How:** Modify `Result.jsx` to call a new `saveResult` endpoint (or reuse Titration's logic) to insert data into the `experiment_results` table.

### 4. Post-Lab Quiz Component — Priority: MEDIUM | Effort: MEDIUM
**What:** A short 3-question quiz on the `Result` page before showing the full analysis.
**Why:** transforms the app from a "toy" to an "assessment tool".
**Where in code:** `client/src/pages/result.jsx`
**How:** Add a `QuizSection` component that gates the "Product Data" or appears alongside it. Store quiz scores in `experiment_results`.

### 5. Lab Notebook / Observations — Priority: MEDIUM | Effort: MEDIUM
**What:** A collapsible sidebar or modal to take notes during the experiment.
**Why:** Encourages the scientific method (Hypothesis -> Observation).
**Where in code:** `client/src/pages/lab.jsx`, `client/src/components/Sidebar.jsx` (reuse or new)
**How:** Add a `LabNotebook` component with a text area that persists to `localStorage` or state, then saves with the result.

### 6. Accessibility Improvements — Priority: MEDIUM | Effort: LOW
**What:** Add `aria-labels` to sliders and buttons; ensure keyboard navigation works.
**Why:** Compliance and inclusivity. `Lab.jsx` sliders currently lack descriptive labels for screen readers.
**Where in code:** `client/src/pages/lab.jsx`
**How:** Add `aria-label="Concentration of HCl"` to inputs. Ensure color contrast ratios in `accessibility.css` are sufficient.

### 7. Export Lab Report (PDF) — Priority: LOW | Effort: MEDIUM
**What:** specific button to download the result summary as a PDF.
**Why:** Students need to submit evidence of work.
**Where in code:** `client/src/pages/result.jsx`
**How:** Use `jspdf` or similar to generate a simple PDF from the `data` state.

## Quick Wins (< 1 day each)
1.  **Safety Modal:** Simple state-based popup in `Lab.jsx`.
2.  **Tooltips:** Add `title` attributes or custom tooltips to chemical icons in `Lab.jsx`.
3.  **Result "Save" Fix:** Call the Supabase insert from `Result.jsx` to populate History.
