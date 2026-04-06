## 2024-10-26 - Pre-Lab Safety & Walkthrough Gap
**Market Insight:** Top virtual chemistry labs (like PraxiLabs and Labster) enforce a mandatory pre-lab safety check (PPE, hazard awareness) and offer step-by-step guided walkthroughs ("Oxi" AI assistant in PraxiLabs) before students can freely experiment.
**Codebase Match:** The Alchemistry app (`client/src/pages/Lab3D.jsx`) allows students to immediately start mixing chemicals without any safety acknowledgment or structured onboarding, relying only on a reactive AI hint system.
**Opportunity:** Implement a lightweight `PreLabCheckModal` component before rendering the `Lab3D` canvas, and add a "Guided Mode" flag in `Lab3D` that sequences the expected chemical mixtures step-by-step.
