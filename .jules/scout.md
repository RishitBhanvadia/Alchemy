## 2025-05-19 - Virtual Chemistry Lab Export Gap
**Market Insight:** Top chemistry simulation products like ChemCollective and Labster provide robust mechanisms for students and teachers to export experimental results (often as CSV) for off-platform analysis and grading.
**Codebase Match:** The `history.jsx` page in Alchemistry fetches an experiment log that currently just renders as an HTML table.
**Opportunity:** Add a CSV export feature to the history page. The `logs` data from `useHistoryStore` is already loaded in memory and maps perfectly to CSV. We can implement a simple CSV export function using standard browser APIs without external dependencies like Papa Parse.
