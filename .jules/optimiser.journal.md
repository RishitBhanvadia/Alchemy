## 2026-03-03 - Vitest Config Exclusions (ERR_REQUIRE_ESM)
**Learning:** Hardcoding exclusions (like '**/tests/**' and '**/*.spec.js') inside 'exclude' rather than importing  avoids CI breakages in some Node 18 setups where 'html-encoding-sniffer' breaks via .
**Action:** When working with Vite + Vitest, simply list explicit strings in the test.exclude array.
## 2026-03-03 - Vitest Config Exclusions (ERR_REQUIRE_ESM)
**Learning:** Hardcoding exclusions (like '**/tests/**' and '**/*.spec.js') inside 'exclude' rather than importing configDefaults avoids CI breakages in some Node 18 setups where 'html-encoding-sniffer' breaks.
**Action:** When working with Vite + Vitest, simply list explicit strings in the test.exclude array.
