const fs = require('fs');

function updateWorkflowNodeVersion(filePath) {
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/node-version:\s*\[?['"]?18(\.x)?['"]?\]?/g, "node-version: [20.x]");
        content = content.replace(/node-version: ['"]?18(\.x)?['"]?/g, "node-version: 20");
        fs.writeFileSync(filePath, content);
    }
}

updateWorkflowNodeVersion('.github/workflows/build-check.yml');
updateWorkflowNodeVersion('.github/workflows/ci.yml');
updateWorkflowNodeVersion('.github/workflows/deploy-verify.yml');
updateWorkflowNodeVersion('.github/workflows/verification.yml');
