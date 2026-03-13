const fs = require('fs');
let content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
content = content.replace('run: npm run test:coverage -- --run', 'run: npm install --no-save @vitest/coverage-v8 && npm run test:coverage -- --run');
fs.writeFileSync('.github/workflows/ci.yml', content, 'utf8');
