const { createClient } = require('@supabase/supabase-js');
const { error } = require('../utils/response');

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

exports.requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'UNAUTHORIZED', 'No authorization header provided.', 401);
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('[requireAuth]', authError?.message || 'No user found');
            return error(res, 'UNAUTHORIZED', 'Invalid or expired token.', 401);
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('[requireAuth]', err.message);
        return error(res, 'INTERNAL_ERROR', 'Authentication failed due to server error.', 500);
    }
};

exports.requireRole = (role) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return error(res, 'UNAUTHORIZED', 'Authentication required.', 401);
            }

            const { data: profile, error: dbError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', req.user.id)
                .single();

            if (dbError) {
                console.error('[requireRole] Profile fetch error:', dbError.message);
                return error(res, 'INTERNAL_ERROR', 'Failed to fetch user role.', 500);
            }

            if (!profile || profile.role !== role) {
                return error(res, 'FORBIDDEN', `Access denied. Requires ${role} role.`, 403);
            }

            next();
        } catch (err) {
            console.error('[requireRole]', err.message);
            return error(res, 'INTERNAL_ERROR', 'Role verification failed.', 500);
        }
    };
};
