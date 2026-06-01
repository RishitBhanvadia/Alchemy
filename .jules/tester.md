## 2024-06-01 - Add fallback profile creation coverage
**Gap:** The authStore's fetchProfile fallback logic for missing profiles (error code PGRST116) was completely uncovered.
**Learning:** This missing coverage meant that if the initial database trigger failed to create a profile, the fallback creation logic wasn't verified, risking user authentication failures.
**Pattern:** Mocking consecutive calls to Supabase methods to simulate a failure on the initial select().single() and a success on the subsequent insert().single() verifies the fallback logic.
