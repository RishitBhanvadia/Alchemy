# Scout Journal

## 2026-02-20 - Guided Learning Gap
**Market Insight:** Top competitors (Labster, PraxiLabs) heavily rely on "Guided Inquiry" — step-by-step instructions overlaid on the UI. They don't just simulate the lab; they simulate the *instructor*.
**Codebase Match:** Alchemistry currently provides the *tools* (chemicals, test tubes) but not the *instructions*. The `Titration.jsx` component allows experimentation but doesn't tell the user *what* to do next.
**Opportunity:** Build a reusable `GuideOverlay` component that can be "scripted" for each lab module. This transforms the app from a "Toy" to a "Tool" for education.
