## 2025-02-27 - Alchemistry Competitor Research Insight
**Market Insight:** Top virtual chemistry labs (Labster, PraxiLabs) all provide ways for students to export their experiment data as formal lab reports or CSV files for teacher submission and personal record keeping.
**Codebase Match:** Alchemistry tracks experiments in Supabase and displays them on the `History` page (`client/src/pages/history.jsx`) via `useHistoryStore`, but completely lacks any export functionality.
**Opportunity:** Add a CSV export feature to the History page. It's a low-effort, high-impact feature expected in educational tools that can be easily implemented using standard JavaScript Blob/CSV generation.
