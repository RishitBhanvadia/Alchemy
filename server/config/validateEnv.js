// server/config/validateEnv.js
const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'GEMINI_API_KEY',
];

function validateEnv() {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ STARTUP FAILED: Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\nCopy server/.env.example to server/.env and fill in the values.');
    process.exit(1); // crash immediately — better than a confusing error later
  }
  console.log('✅ Environment variables validated.');
}

module.exports = validateEnv;
