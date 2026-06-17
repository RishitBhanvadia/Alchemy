const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8');

// The rule is: @import url(...) must precede @import "tailwindcss" if we are using standard css behavior but wait, tailwindcss v4 requires @import "tailwindcss" first? Let's check memory:
// "When using Tailwind CSS via `@import \"tailwindcss\";` in a Vite project, ensure that any other standard CSS `@import` statements (such as external font imports) strictly precede the Tailwind import. Failing to do so will result in an esbuild transform error causing the build to fail."

css = css.replace('@import "tailwindcss";\n\n@import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap\');', '@import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap\');\n@import "tailwindcss";');

fs.writeFileSync('client/src/index.css', css);
