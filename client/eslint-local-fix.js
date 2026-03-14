const fs = require('fs');
const configPath = './.eslintrc.json';
if (fs.existsSync(configPath)) {
    let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config.rules['react/no-unknown-property']) {
        config.rules['react/no-unknown-property'] = ['error', { ignore: [] }];
    }
    const ignoreList = config.rules['react/no-unknown-property'][1].ignore;
    ['uColor', 'visible', 'depthWrite', 'array', 'count', 'itemSize', 'vertexColors', 'sizeAttenuation', 'blending'].forEach(prop => {
        if (!ignoreList.includes(prop)) ignoreList.push(prop);
    });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
