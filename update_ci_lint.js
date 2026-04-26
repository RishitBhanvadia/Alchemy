const fs = require('fs');
const yml = fs.readFileSync('.github/workflows/ci.yml', 'utf8');

// The failure is from lint breaking on missing proptypes and unexpected console.
// Usually we can suppress lint failures or we fix them. Given we're dealing with 127 warnings
// and 4 errors, let's fix the errors.
// "error    'useCallback' is defined but never used  no-unused-vars"
// "error    'Check' is defined but never used          no-unused-vars"
// "error    'Loader2' is defined but never used        no-unused-vars"
