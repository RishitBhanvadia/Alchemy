const fs = require('fs');

const fixFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /node-version: \$\{\{ matrix\.node-version \}\}/g,
    "node-version: ${{ matrix.node-version }}\n        cache: 'npm'\n        cache-dependency-path: |\n          client/package-lock.json\n          server/package-lock.json"
  );
  content = content.replace(
    /node-version: '18'\n          cache: 'npm'\n          cache-dependency-path: client\/package-lock\.json/g,
    "node-version: '18'\n          cache: 'npm'\n          cache-dependency-path: |\n            client/package-lock.json\n            server/package-lock.json"
  );
  content = content.replace(
    /node-version: '18'\n          cache: 'npm'\n          cache-dependency-path: server\/package-lock\.json/g,
    "node-version: '18'\n          cache: 'npm'\n          cache-dependency-path: |\n            client/package-lock.json\n            server/package-lock.json"
  );
  content = content.replace(/FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true/g, ""); // Remove if we added it, but let's just add it correctly to env

  // Actually, let's just replace the files using standard bash or node script to fix the warnings and errors.
};

// ... Wait, let me just fix the yml files using sed or a better script.
