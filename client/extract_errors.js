const fs = require('fs');
const results = JSON.parse(fs.readFileSync('lint_results_utf8.json', 'utf8').substring(fs.readFileSync('lint_results_utf8.json', 'utf8').indexOf('[')));
const errors = results.filter(r => r.errorCount > 0);
errors.forEach(r => {
  console.log(`File: ${r.filePath}`);
  r.messages.filter(m => m.severity === 2).forEach(m => {
    console.log(`  Line ${m.line}: ${m.ruleId} - ${m.message}`);
  });
});
