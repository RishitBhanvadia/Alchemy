## 2024-05-23 - Data Persistence & Educational Gaps
**Market Insight:** Virtual labs are typically heavily structured (scenario-based) or completely open (sandbox). The "sweet spot" is a *guided sandbox* where users can experiment freely but have clear goals (e.g., "Synthesize Aspirin").
**Codebase Match:** Alchemistry currently has split logic for saving results: `Titration` saves to Supabase, but the main `Lab` only saves to `localStorage`. This breaks the user's learning history.
**Opportunity:** Unifying the data layer to treat `Lab` experiments as first-class citizens in the `History` table is a critical, low-hanging fruit to improve retention and utility.
