const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder_key'
);

const unauthorized = (res, message = 'Unauthorised — no token.') => {
  return res.status(401).json({ success: false, error: { code: 'UNAUTHORISED', message } });
};

const forbidden = (res, message) => {
  return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message } });
};

const serverError = (res, message = 'Internal server error during role validation.') => {
  return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message } });
};

exports.requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return unauthorized(res, 'No auth token provided.');

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw error || new Error('User not found');

    req.user = user;
    next();
  } catch (err) {
    console.error('[requireAuth]', err.message);
    return unauthorized(res, 'Invalid or expired token.');
  }
};

exports.requireRole = (role) => async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || profile.role !== role) {
      return forbidden(res, `Access restricted to ${role} role only.`);
    }
    
    req.profile = profile;
    next();
  } catch (err) {
    console.error('[requireRole]', err.message);
    return serverError(res);
  }
};
