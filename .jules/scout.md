## 2026-06-03 - Guided Experiments
**Market Insight:** Leading virtual lab simulators like Labster and ExploreLearning Gizmos provide highly guided experiments with contextual tips, step-by-step guidance, and scenario-based learning to reduce cognitive overload and help beginners effectively use the labs.
**Codebase Match:** Alchemistry currently lacks a structured, step-by-step guided tutorial or scenario mode for beginners within the 3D lab environment.
**Opportunity:** Implement a guided experiment mode or onboarding tutorial in `Lab3D.jsx` using contextual tooltips or an overlay guide that walks students through basic interactions (e.g., measuring, pouring).

## 2026-06-03 - Exportable Lab Reports
**Market Insight:** Top virtual labs allow students to generate and export formal lab reports (PDF/CSV) detailing their procedure, observations, and results.
**Codebase Match:** Alchemistry has a history view (`History.jsx`) and tracks experiment logs in the database, but it lacks a feature to export these results into a formal report format.
**Opportunity:** Add a "Download Lab Report" button in `Result.jsx` or `History.jsx` that formats the experiment data into a downloadable PDF or CSV.
