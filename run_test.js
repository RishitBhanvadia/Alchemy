process.env.SUPABASE_URL = "http://localhost";
process.env.SUPABASE_KEY = "test";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test";
try { require('./server/server.js') } catch (e) { if (e.message.includes('STARTUP FAILED')) process.exit(0); throw e; }
