## 2024-05-30 - EdTech Virtual Labs Lack Onboarding & Safety Context
**Market Insight:** Leading virtual lab competitors like Labster and PraxiLabs emphasize structured learning paths, guided onboarding, and explicit safety protocols (virtual PPE) before entering the simulation.
**Codebase Match:** Alchemistry drops users directly into complex labs (`client/src/pages/lab.jsx`, `client/src/pages/titration.jsx`) with minimal onboarding and no safety checks.
**Opportunity:** Introduce a lightweight "Virtual PPE Check" modal and guided tour (e.g. using `react-joyride`) in the lab/titration modules to align with educational table stakes.

## 2024-05-30 - Real-time Data Visualization Gap
**Market Insight:** Competitors like ChemCollective provide real-time theoretical data visualization (e.g., concentration viewers, real-time graphs) to connect visual simulations with theoretical chemistry concepts.
**Codebase Match:** The `Titration` component uses hardcoded arrays (`all_data`) and doesn't display a real-time graph of pH/concentration as the reaction progresses.
**Opportunity:** Add a real-time graph visualization (e.g., using Recharts) to the Titration module that plots volume added against an estimated pH curve.
