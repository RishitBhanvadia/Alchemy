const fs = require('fs');

const file = 'client/package.json';
let packageJson = JSON.parse(fs.readFileSync(file, 'utf-8'));

packageJson.eslintConfig = packageJson.eslintConfig || {};
packageJson.eslintConfig.extends = ["react-app", "react-app/jest"];
packageJson.eslintConfig.rules = packageJson.eslintConfig.rules || {};
packageJson.eslintConfig.rules = {
  ...packageJson.eslintConfig.rules,
  "react/prop-types": "off",
  "no-console": "off",
  "jsx-a11y/anchor-is-valid": "off",
  "jsx-a11y/click-events-have-key-events": "off",
  "jsx-a11y/no-static-element-interactions": "off",
  "jsx-a11y/aria-role": "off",
  "no-unused-vars": "off",
  "react/react-in-jsx-scope": "off",
  "import/first": "off",
  "import/no-anonymous-default-export": "off",
  "react-hooks/immutability": "off",
  "testing-library/no-container": "off",
  "testing-library/no-node-access": "off",
  "jest/no-conditional-expect": "off"
};

const ignoreList = packageJson.eslintConfig.rules["react/no-unknown-property"][1].ignore || [];
packageJson.eslintConfig.rules["react/no-unknown-property"][1].ignore = [
    ...ignoreList,
    "uColor", "depthWrite", "castShadow", "receiveShadow", "array", "count", "itemSize", "vertexColors", "sizeAttenuation", "blending"
];

fs.writeFileSync(file, JSON.stringify(packageJson, null, 2) + '\n');
