## 2025-03-07 - Improve Note Box styling in Titration panel
**Problem:** The important informational note ("NOTE: The solution of HCl is 1 M...") at the bottom of the Titration controls was rendering invisibly/poorly due to broken visual hierarchy and lacking the intended red accent.
**Context:** For this virtual lab app, explicit clarity on chemical constraints (like molarity) is critical for user success in experiments. If they miss the note, they will calculate wrong values.
**Solution:** Fixed a malformed CSS block in `titration.css` where properties were orphaned without a selector. Wrapping them in `.note-box` successfully restored the intended high-contrast visual design, improving readability and drawing the user's attention to the experiment parameters.
