const fs = require('fs');
let content = fs.readFileSync('client/vite.config.js', 'utf-8');
content = content.replace(
  "inline: ['@exodus/bytes', 'html-encoding-sniffer']",
  "inline: [/@exodus\\/bytes/, /html-encoding-sniffer/]"
);
fs.writeFileSync('client/vite.config.js', content);
