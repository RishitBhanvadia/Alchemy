const fs = require('fs');

let content = fs.readFileSync('server/server.js', 'utf8');

// The instruction mentioned:
// In the Alchemistry server, application startup logic (like `app.listen()` and strict environment validation) must be wrapped in an `if (require.main === module)` block. This ensures the server only runs continuously when executed directly, preventing it from hanging GitHub Actions CI scripts that test the server via import/require.

content = content.replace("const server = app.listen(PORT, '0.0.0.0', () => {\n    logger.info(`Server running on port ${PORT}`);\n});", `let server;
if (require.main === module) {
    server = app.listen(PORT, '0.0.0.0', () => {
        logger.info(\`Server running on port \${PORT}\`);
    });
}
`);

// The environment validation should also be conditionally applied
// The original:
/*
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const validateEnv = require('./config/validateEnv');
validateEnv(); // exits process if any required var is missing
*/
content = content.replace("validateEnv(); // exits process if any required var is missing", "if (require.main === module) { validateEnv(); }");

content = content + "\nmodule.exports = app;\n";

fs.writeFileSync('server/server.js', content);
