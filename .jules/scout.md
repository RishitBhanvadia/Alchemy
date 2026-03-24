## 2026-03-24 - Exportable Lab Reports Are Table-Stakes
**Market Insight:** In the EdTech virtual lab space (Labster, PraxiLabs), a fundamental feature is the ability for students to generate and export formal lab reports (PDF/CSV) to submit as assignments.
**Codebase Match:** The app already saves experiment outcomes to Supabase (`experiment_results`) and displays them in `/history` and `result.jsx`, but lacks an export mechanism.
**Opportunity:** Adding a "Download Report" button that formats existing history data into a printable format (or CSV) provides immediate value to students and teachers for grading workflows.

## 2026-03-24 - Pre-lab Safety & PPE Checklists
**Market Insight:** Top virtual labs enforce a virtual PPE (Personal Protective Equipment) and safety checklist before allowing students to start an experiment. It builds good real-world habits.
**Codebase Match:** Currently, users jump straight into `/student/lab` or `/titration` without a safety interstitial.
**Opportunity:** We can add a simple modal in the Lab pages that requires the user to toggle "Goggles", "Gloves", and "Lab Coat" before the experiment controls are enabled.

## 2026-03-24 - Interactive Guided Onboarding
**Market Insight:** High school students often get overwhelmed by open-ended lab simulations. Platforms like Futuclass use 5-minute guided tutorials showing how to use the controls.
**Codebase Match:** The 3D Lab and Titration pages have tooltips and AI hints, but no step-by-step onboarding for first-time users.
**Opportunity:** Implement a lightweight `localStorage` flag (`hasSeenTutorial`) and a series of spotlight tooltips (using a library like `react-joyride` or custom) to guide the first experiment.
