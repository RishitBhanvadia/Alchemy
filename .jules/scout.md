## 2024-05-24 - AI Proactive Lab Assistance
**Market Insight:** Competitors like PraxiLabs use an AI assistant ("Oxi") that proactively offers help during experiments to guide students.
**Codebase Match:** Alchemistry already has an `AiTutorPanel` component and `Gemini Flash Tutor` integration, but it is currently passive (requires user click).
**Opportunity:** Make the AI Tutor proactive. Trigger a small toast or notification prompting the user to ask the AI when a reaction fails or results in a generic "Mixing..." outcome in `Lab3D.jsx`.

## 2024-05-24 - Narrative-Driven Scenarios
**Market Insight:** Market leader Labster relies heavily on gamified storytelling and real-world scenarios (e.g., "teaching community college chemistry where graduation isn't guaranteed") to boost engagement over pure sandbox simulators.
**Codebase Match:** Alchemistry's `StudentDashboard.jsx` currently points users to open-ended modules (Lab3D, Titration, etc.) without narrative framing.
**Opportunity:** Implement "Scenario Mode" using pre-configured laboratory states, wrapped in a narrative context (e.g., neutralize an acid spill). This can be built on top of the existing `labStore` and `Lab3D` component by seeding the state from a configuration file.
