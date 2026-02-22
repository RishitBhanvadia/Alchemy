# Scout's Journal

## 2025-02-18 - Data Persistence Gap
**Market Insight:** Top competitors like Labster and PraxiLabs centralize all student progress, feeding into LMS or gradebooks. This is "table stakes" for institutional adoption.
**Codebase Match:** I discovered a critical disconnect: while `Titration.jsx` correctly writes results to the Supabase `experiment_results` table, the main `Lab.jsx` and `Result.jsx` workflow relies entirely on `localStorage` ("cart"). This means general chemistry experiments are effectively "lost" to the backend and won't appear on the History page.
**Opportunity:** Unifying this data flow is a high-priority backend fix that instantly increases the value of the platform by creating a comprehensive student portfolio.

## 2025-02-18 - The "Guided Inquiry" Opportunity
**Market Insight:** Virtual labs are moving away from pure "sandbox" models towards "guided inquiry" where students are scaffolded through the scientific method (Hypothesis -> Experiment -> Analysis).
**Codebase Match:** Alchemistry is currently a "sandbox". Adding a toggle for "Guided Mode" (using `react-joyride` or similar) would bridge the gap between a simulator and a teaching tool, directly competing with PraxiLabs' "Oxi" assistant but with a potentially lower implementation cost.
**Opportunity:** Implement a "Lab Partner" overlay that guides the first experiment.
