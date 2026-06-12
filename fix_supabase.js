const fs = require('fs');

let content = fs.readFileSync('server/supabaseClient.js', 'utf8');

content = content.replace("const supabase = createClient(supabaseUrl, supabaseKey);", "const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseKey || 'placeholder');");

fs.writeFileSync('server/supabaseClient.js', content);
