## 2024-05-24 - Lazy loading recharts
**Learning:** Heavy charting libraries like recharts should be lazy-loaded in React using React.lazy and Suspense to prevent bloating initial bundle sizes.
**Action:** Always wrap heavy, non-critical components (like charts below the fold) in React.lazy and Suspense.