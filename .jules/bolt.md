## 2024-05-18 - Lazy load Recharts for dashboard
**Learning:** Recharts is a very heavy dependency that can severely impact the initial bundle size and page load time when included statically.
**Action:** Always lazy load chart libraries like Recharts using `React.lazy` and `Suspense` when they are used below the fold or not strictly required for the immediate initial render. Make sure `Suspense` fallbacks gracefully use existing loaders or properly defined styles.
