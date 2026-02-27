## 2024-05-24 - [Unoptimized Heavy Assets Impacting Bundle Size]
**Bottleneck:** The `labgigbl.gif` asset is 1.8MB and is imported directly in `InExpResult` and `experiment_result` components, causing it to be bundled eagerly or inflating the chunk size significantly, potentially blocking initial render or navigation.
**Impact:** Lazy loading these components will defer the loading of this 1.8MB asset until the user actually interacts with the experiment result, significantly reducing the initial load time and memory usage for the main lab pages.
**Learning:** Heavy assets like detailed GIFs should always be lazy-loaded or code-split, especially when they are only needed in specific user interaction states (like showing a result after an experiment).
