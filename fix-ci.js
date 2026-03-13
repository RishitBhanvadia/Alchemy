const fs = require('fs');
let content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
content = content.replace('node-version: [18.x]', 'node-version: [20.x]');
fs.writeFileSync('.github/workflows/ci.yml', content, 'utf8');
