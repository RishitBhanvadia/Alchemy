const fs = require('fs');

function fixFiles(file) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/node-version:\s*20/g, "node-version: 22");
        content = content.replace(/node-version:\s*\[20\]/g, "node-version: [22]");
        content = content.replace(/node-version:\s*['"]?18['"]?/g, "node-version: 22");
        fs.writeFileSync(file, content);
    }
}

fixFiles('.github/workflows/build-check.yml');
fixFiles('.github/workflows/ci.yml');
fixFiles('.github/workflows/deploy-verify.yml');
