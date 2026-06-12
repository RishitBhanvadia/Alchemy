const fs = require('fs');

let content = fs.readFileSync('server/middleware/authMiddleware.js', 'utf8');
content = content.replace("process.env.SUPABASE_URL || 'http://localhost:54321'", "process.env.SUPABASE_URL || 'http://localhost:54321'");
content = content.replace("process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder'", "process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder'");
fs.writeFileSync('server/middleware/authMiddleware.js', content);
