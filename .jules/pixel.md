## 2024-06-12 - Improve Recent Experiments UI

**Problem:** The Recent Experiments list lacked visual contrast for successful vs. neutral outcomes, relying solely on a small dot.
**Context:** Students need to quickly scan their experiment history and identify successful reactions vs. incomplete mixtures.
**Solution:** Added subtle background tints and borders (`success-log` and `neutral-log` classes) to `.mini-log-item` depending on the experiment's outcome. Also added a subtle translate animation on hover for better interaction feedback.
