## 2024-05-15 - Gamified Quiz and Cautionary Warnings

**Market Insight:** Top virtual labs (PraxiLabs, ChemCollective) provide integrated quiz builders and highlight cautionary notes for toxic materials before experiments. PhET emphasizes alternative inputs and sonification for inclusive design.
**Codebase Match:** Alchemistry already has an `assignmentStore` and `StudentDashboard` to track student targets, plus an `AiTutorPanel` for guidance. However, it lacks a way to evaluate students via quizzes and does not provide upfront safety warnings for chemicals.
**Opportunity:** Extend `assignmentStore` to support custom quizzes and use `AiTutorPanel` to display cautionary warnings when certain chemicals are selected. Add alternative input controls for the 3D lab.
