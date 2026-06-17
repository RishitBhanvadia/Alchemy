const fs = require('fs');

function updateWorkflowNodeVersion(filePath) {
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/node-version:\s*20\n/g, "node-version: [20]\n");
        // For build-check.yml
        content = content.replace(/node-version: 20\s+cache:/g, "node-version: 20\n          cache:");
        fs.writeFileSync(filePath, content);
    }
}

updateWorkflowNodeVersion('.github/workflows/ci.yml');
