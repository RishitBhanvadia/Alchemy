import re

with open('server/middleware/authMiddleware.js', 'r') as f:
    content = f.read()

content = content.replace("process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY", "process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY")

with open('server/middleware/authMiddleware.js', 'w') as f:
    f.write(content)
