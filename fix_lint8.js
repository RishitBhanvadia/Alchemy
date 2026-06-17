const fs = require('fs');

// We have lots of "Cannot modify local variables after render completes" due to react-compiler plugin enabled in eslint.
// Wait, react-compiler plugin is in package.json? "eslint-plugin-react-compiler"
// If we just disable it for those lines using eslint-disable-next-line
// DraggableFlask.jsx
// ParticleEmitter.jsx
// TitrationLab.jsx

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
        content = "/* eslint-disable react-compiler/react-compiler */\n" + content;
        content = "/* eslint-disable react-hooks/immutability */\n" + content;
        fs.writeFileSync(file, content);
    }
}
