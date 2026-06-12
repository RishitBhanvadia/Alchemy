const { createClient } = require('@supabase/supabase-js');
const { success, error } = require('../utils/response');

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getTitrationData = async (req, res) => {
    try {
        const { data, error: dbError } = await supabase
            .from('titration_data')
            .select('*');

        if (dbError) {
            console.error('[getTitrationData] Supabase error:', dbError.message);
            return error(res, 'INTERNAL_ERROR', 'Failed to fetch titration data.', 500);
        }

        return success(res, { titration_data: data || [] });
    } catch (err) {
        console.error('[getTitrationData]', err.message);
        return error(res, 'INTERNAL_ERROR', 'An unexpected error occurred.', 500);
    }
};
