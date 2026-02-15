## 2024-05-24 - Route-Based Code Splitting Impact
**Learning:** Route-based code splitting significantly reduced the initial bundle size (from ~385kB to ~56kB), confirming it was a major bottleneck for initial load time.
**Action:** Always check for heavy dependencies (three.js) in the main bundle and split them out aggressively using React.lazy.
