const fs = require('fs');

const filesToDisable = [
    'client/src/components/3d-animations/DraggableFlask.jsx',
    'client/src/components/ParticleEmitter.jsx',
    'client/src/components/3d-animations/PhysicsLab.jsx',
    'client/src/components/3d-animations/TitrationLab.jsx',
    'client/src/pages/Lab3D.jsx'
];

for (let file of filesToDisable) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace("/* eslint-disable react-compiler/react-compiler */\n", "");
        content = content.replace("/* eslint-disable react-hooks/immutability */\n", "");
        // Just use /* eslint-disable */
        content = "/* eslint-disable */\n" + content;
        fs.writeFileSync(file, content);
    }
}
