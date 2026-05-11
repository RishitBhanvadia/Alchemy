## 2026-05-11 - Guided Workflows and Export Capabilities in Virtual Labs
**Market Insight:** Top virtual lab tools (Labster, PhET) provide guided experiment workflows with step-level feedback and robust data export capabilities to support assessment.
**Codebase Match:** Alchemistry currently provides free-form experimentation with an AI tutor (`AiTutorPanel`), but lacks structured, guided checkpoints (`hasSeenTip` state or guided modals) and data export for its `History` logs (`client/src/pages/history.jsx`).
**Opportunity:** Introduce a structured onboarding flow using `hasSeenTip` localStorage flags wrapping interactive elements, and add an `ExportButton` to the History page to map experiment logs to CSV for educators.
