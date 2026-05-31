const supabase = require('../supabaseClient');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

/**
 * Generates a unique code by checking Supabase for collisions.
 * Retries up to 10 times before failing.
 */
async function generateUniqueCode(length, table, column = 'code') {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode(length);
    const { data } = await supabase
      .from(table)
      .select('id')
      .eq(column, code)
      .limit(1);

    if (!data || data.length === 0) return code;
  }
  throw new Error(`Failed to generate unique code for ${table} after 10 attempts`);
}

module.exports = { generateCode, generateUniqueCode };
