const fs = require('fs');
let report = fs.readFileSync('.jules/command-report-2024-04-18-13.md', 'utf8');

// Remove Fix Prompt #2 entirely
report = report.split('### Fix Prompt #2')[0];

// Fix the Date mismatch in the markdown header
report = report.replace('**Date:** 2026-04-18', '**Date:** 2024-04-18');

fs.writeFileSync('.jules/command-report-2024-04-18-13.md', report);
