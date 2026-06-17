const fs = require('fs');

function fixCI(filePath) {
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/node-version: \[20\]/g, "node-version: [20.x]");
        fs.writeFileSync(filePath, content);
    }
}

fixCI('.github/workflows/ci.yml');
