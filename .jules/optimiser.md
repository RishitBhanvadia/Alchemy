## 2024-06-16 - Reduce Large GIF Sizes for Bundle Optimization
**Bottleneck:** Extremely large, uncompressed animated GIFs (`labgigbl.gif` at 1.8MB, `labgif.gif` at 1.6MB) in the application bundle impacting initial load time and resulting in slow asset fetching.
**Impact:** Significantly reduced total asset bundle size by ~2MB (~60% reduction in those files) by using gifsicle to optimize the GIFs (reducing color depth and applying compression).
**Learning:** Found multiple loading screen GIFs that weren't optimized, causing unnecessary network overhead on page load since they are included in component bundle definitions.
