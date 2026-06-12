const fs = require('fs');

let content = fs.readFileSync('server/controllers/titrationController.js', 'utf8');
content = content.replace("const supabaseUrl = process.env.SUPABASE_URL;", "const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';");
content = content.replace("const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;", "const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder';");
fs.writeFileSync('server/controllers/titrationController.js', content);

content = fs.readFileSync('server/controllers/resultController.js', 'utf8');
content = content.replace("const supabaseUrl = process.env.SUPABASE_URL;", "const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';");
content = content.replace("const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;", "const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder';");
fs.writeFileSync('server/controllers/resultController.js', content);
