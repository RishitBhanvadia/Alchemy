## 2024-06-12 - Added server utility and controller tests
**Gap:** The critical backend business logic for computing reactions and regimens (`reactionHash.js`, `regimeClassifier.js`) and the controller executing this logic (`resultController.js`) had zero test coverage.
**Learning:** These utilities are the source of truth for the entire application's core functionality (calculating a chemical reaction outcome). Without them tested, any change could silently break the app's main feature.
**Pattern:** Extracted business logic into pure utility functions first, making them easy to unit test using simple inputs/outputs without needing to mock Express, databases, or API clients. Mocked Supabase in the controller test to verify fallback logic.
