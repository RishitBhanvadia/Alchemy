## 2024-05-22 - From Simulation to Education
**Market Insight:** The virtual lab market (Labster, PraxiLabs) distinguishes "simulations" from "labs" by adding educational scaffolding: pre-lab safety checks, guided walkthroughs, and post-lab quizzes. Users (teachers) value the *assessment* as much as the *experiment*.
**Codebase Match:** Alchemistry has robust 3D simulations (`Lab.jsx`, `Titration.jsx`) but lacks this educational wrapper. The `Result.jsx` page is purely informational, and `Lab.jsx` assumes the user knows the procedure.
**Opportunity:** Build the "Lab Wrapper": A `SafetyModal` component before experiments and a `QuizSection` component in `Result.jsx`. This bridges the gap between a tech demo and an ed-tech product.
