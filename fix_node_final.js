const fs = require('fs');

function fixFiles(file) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/node-version:\s*\[?['"]?20\.x['"]?\]?/g, "node-version: 20");
        content = content.replace(/node-version:\s*\[?['"]?18\.x['"]?\]?/g, "node-version: 20");
        content = content.replace(/node-version:\s*['"]?18['"]?/g, "node-version: 20");
        content = content.replace(/node-version:\s*\[?['"]?24\.x['"]?\]?/g, "node-version: 20");
        content = content.replace(/node-version:\s*['"]?24['"]?/g, "node-version: 20");
        fs.writeFileSync(file, content);
    }
}

fixFiles('.github/workflows/build-check.yml');
fixFiles('.github/workflows/ci.yml');
fixFiles('.github/workflows/deploy-verify.yml');
