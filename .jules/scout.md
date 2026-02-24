## 2026-02-24 - Critical Gap in Experiment Tracking
**Market Insight:** All major competitors (Labster, PraxiLabs) treat experiment history as a core "Learning Management System" (LMS) feature, ensuring every student action is logged for assessment.
**Codebase Match:** The `Result.jsx` component in Alchemistry saves general lab results to `localStorage` (as a 'cart'??) but fails to write to the Supabase `experiment_results` table. Only the `Titration` module correctly saves to the database.
**Opportunity:** Unify the tracking logic. This is a critical "bug" masquerading as a missing feature. Fixing this immediately adds value for teachers/assessors.

## 2026-02-24 - Safety First as a Differentiator
**Market Insight:** "Safety First" is a primary selling point for virtual labs. Competitors like PraxiLabs explicitly market "0% Dangers" but also reinforce safety protocols (PPE checks) to build good habits.
**Codebase Match:** Alchemistry currently has zero safety checks. Students enter the lab and start mixing chemicals immediately.
**Opportunity:** Add a simple "PPE Check" modal (Goggles, Coat, Gloves) before entering the lab. This is a low-effort, high-impact feature that significantly boosts the educational credibility of the app.
