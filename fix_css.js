const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8');
if (css.includes("@import 'tailwindcss';")) {
    css = css.replace("@import 'tailwindcss';", "");
    css = "@import 'tailwindcss';\n" + css;
}
fs.writeFileSync('client/src/index.css', css);
