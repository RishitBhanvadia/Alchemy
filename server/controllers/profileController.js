const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');

exports.getProfile = async (req, res) => {
  try {
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url, created_at')
      .eq('id', req.user.id)
      .limit(1)
      .single();

    if (dbError) {
      console.error('[getProfile] DB error:', dbError.message);
      return error(res, 'NOT_FOUND', 'Profile not found.', 404);
    }

    return success(res, { profile });
  } catch (err) {
    console.error('[getProfile]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to fetch profile.', 500);
  }
};
