// server/config/validateEnv.js
const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
];

function validateEnv() {
  const missing = required.filter(key => {
    const value = process.env[key];
    return !value || value === 'your-service-role-key-here' || value === 'your-gemini-api-key-here' || value.includes('your-project-id');
  });

  if (missing.length > 0) {
    console.error('❌ STARTUP FAILED: Missing or placeholder required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('\nLocal Development Tip: Copy server/.env.example to server/.env and fill in the actual values.');
    } else {
      console.error('\nProduction Tip: Ensure these variables are set in your Render environment settings dashboard.');
    }
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
  console.log('✅ Environment variables validated.');
}

module.exports = validateEnv;
