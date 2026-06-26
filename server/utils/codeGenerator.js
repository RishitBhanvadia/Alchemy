const supabase = require('../supabaseClient');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a unique alphanumeric code by checking Supabase for collisions.
 * Retries up to 10 times before failing.
 */
async function generateUniqueCode(tableName, columnName, length) {
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }

    const { data } = await supabase
      .from(tableName)
      .select('id')
      .eq(columnName, code)
      .limit(1);

    if (!data || data.length === 0) return code;
  }
  throw new Error(`Failed to generate unique ${columnName} after 10 attempts`);
}

module.exports = { generateUniqueCode };
