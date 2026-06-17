const fs = require('fs');

const file1 = '.github/workflows/build-check.yml';
if (fs.existsSync(file1)) {
    let content = fs.readFileSync(file1, 'utf8');
    content = content.replace(/node-version: ['"]?20\.x['"]?/g, "node-version: '20'");
    content = content.replace(/node-version: \['20'\]/g, "node-version: '20'");
    content = content.replace(/node-version: \[20.x\]/g, "node-version: '20'");
    fs.writeFileSync(file1, content);
}
