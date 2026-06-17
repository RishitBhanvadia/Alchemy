const fs = require('fs');

function fixFiles(file) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/node-version:\s*20\n/g, "node-version: [20]\n");
        fs.writeFileSync(file, content);
    }
}

fixFiles('.github/workflows/ci.yml');
