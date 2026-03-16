const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');

exports.logExperiment = async (req, res) => {
  try {
    const { chem_a, chem_b, chem_i, chem_c, reaction_id, outcome_label, module, experiment_type, score } = req.body;

    const { data, error: dbError } = await supabase
      .from('experiment_results')
      .insert({
        user_id: req.user.id,
        chem_a,
        chem_b,
        chem_i,
        chem_c,
        reaction_id: reaction_id?.toString(),
        outcome_label,
        experiment_type: experiment_type || module || 'inorganic',
        score,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('[logExperiment] DB error:', dbError.message);
      throw dbError;
    }

    return success(res, { log: data }, 201);
  } catch (err) {
    console.error('[logExperiment]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to log experiment.', 500);
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { data, error: dbError } = await supabase
      .from('experiment_results')
      .select('id, chem_a, chem_b, chem_i, chem_c, reaction_id, outcome_label, score, experiment_type, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (dbError) {
      console.error('[getHistory] DB error:', dbError.message);
      throw dbError;
    }

    return success(res, { logs: data || [] });
  } catch (err) {
    console.error('[getHistory]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to fetch experiment history.', 500);
  }
};
