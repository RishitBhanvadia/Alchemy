// server/controllers/resultController.js
const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');
const { computeReactionId, PRESENCE_THRESHOLD } = require('../utils/reactionHash');
const { classifyRegime } = require('../utils/regimeClassifier');

function deriveThermalEffect(result, gas, solid) {
  if (!result) return 'neutral';
  const r = result.toLowerCase();
  if (r.includes('exothermic') || r.includes('heat') || r.includes('light')) return 'exothermic';
  if (r.includes('endothermic') || r.includes('cold')) return 'endothermic';
  if (gas && r.includes('cl2')) return 'exothermic';
  return 'neutral';
}

function determineDanger(result, gas) {
  if (!result) return false;
  const r = result.toLowerCase();
  const dangerous = ['cl2', 'chlorine', 'explosion', 'vigorous', 'hcl', 'hazard'];
  return dangerous.some(d => r.includes(d)) || (gas && r.includes('gas'));
}

function calculateScore(chemA, chemB, chemI, chemC, outcomeLabel) {
  const hasOutcome = outcomeLabel && outcomeLabel !== 'Unknown Reaction' && outcomeLabel !== 'No reaction';
  const concentrationBalance = 100 - Math.max(chemA, chemB, chemI, chemC);
  const numChemicals = [chemA, chemB, chemI, chemC].filter(c => c > 0).length;
  
  const score = 
    (hasOutcome ? 40 : 0) +
    Math.round((concentrationBalance / 100) * 30) +
    (numChemicals >= 2 ? 30 : 0);
  
  return Math.min(100, Math.max(0, score));
}

const validateConcentration = (val) => {
  const n = Number(val);
  return !isNaN(n) && n >= 0 && n <= 100;
};

exports.calculateResult = async (req, res) => {
  try {
    let { chem_a = 0, chem_b = 0, chem_c = 0, chem_d = 0, chem_i, student_id } = req.body;
    
    if (!validateConcentration(chem_a) || !validateConcentration(chem_b) || 
        !validateConcentration(chem_c) || !validateConcentration(chem_d)) {
      return error(res, 'VALIDATION_ERROR', 'Invalid concentration values. Must be numbers between 0 and 100.', 400);
    }
    
    if (student_id && typeof student_id !== 'string') {
      return error(res, 'VALIDATION_ERROR', 'Invalid student_id format.', 400);
    }
    
    // Support both chem_i (new lab) and chem_d (old lab) for indicator
    chem_i = chem_i || chem_d || 0;

    // Step 1: Normalise to sum = 100
    const total = chem_a + chem_b + chem_i + chem_c;
    if (total === 0) return error(res, 'VALIDATION_ERROR', 'All chemicals are at 0%.', 400);
    
    // Round to integers
    let na = Math.round((chem_a / total) * 100);
    let nb = Math.round((chem_b / total) * 100);
    let ni = Math.round((chem_i / total) * 100);
    let nc = 100 - na - nb - ni; // Last one gets the remainder to guarantee sum = 100

    // Handle edge case where rounding causes negative value due to cumulative rounding
    if (nc < 0) {
      const deficit = Math.abs(nc);
      const values = [
        { key: 'na', val: na },
        { key: 'nb', val: nb },
        { key: 'ni', val: ni }
      ];
      // Subtract deficit from the largest value
      const maxEntry = values.reduce((max, curr) => curr.val > max.val ? curr : max, values[0]);
      if (maxEntry.key === 'na') na = Math.max(0, na - deficit);
      else if (maxEntry.key === 'nb') nb = Math.max(0, nb - deficit);
      else ni = Math.max(0, ni - deficit);
      nc = 0;
    }

    // Clamp all values to valid range
    chem_a = Math.max(0, Math.min(100, na));
    chem_b = Math.max(0, Math.min(100, nb));
    chem_i = Math.max(0, Math.min(100, ni));
    chem_c = Math.max(0, Math.min(100, nc));

    // Step 2: Compute reaction_id using fuzzy threshold
    const reaction_id = computeReactionId(chem_a, chem_b, chem_i, chem_c);
    if (reaction_id === 0) return error(res, 'VALIDATION_ERROR', 'No active chemicals detected above threshold.', 400);

    // Step 3: Classify regime for response (handles all chemical dominances)
    const regime = classifyRegime(chem_a, chem_b, chem_i, chem_c);

    // Step 4: Query by reaction_id
    // Note: regime filtering disabled until schema is updated
    let { data, error: dbError } = await supabase
      .from('results')
      .select('*')
      .eq('reaction_id', reaction_id)
      .limit(1)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Supabase query error:', dbError);
    }

    if (!data) {
      return error(res, 'NOT_FOUND', `No reaction found for combination ID ${reaction_id}.`, 404);
    }

    // Transform fields to match expected API response format
    const stateChange = [];
    if (data.solid) stateChange.push('Precipitate');
    if (data.gas) stateChange.push('Gas Evolution');
    if (data.solid && data.solid_color) stateChange.push(`Solid Color: ${data.solid_color}`);
    
    const thermalEffect = deriveThermalEffect(data.result, data.gas, data.solid);
    const isDangerous = determineDanger(data.result, data.gas);
    const score = calculateScore(chem_a, chem_b, chem_i, chem_c, data.result);

    // Optional Step 5: Log experiment if student_id is provided
    // Also log if we have student_id from the new parameter extraction above
    const targetStudentId = student_id || req.body.student_id;
    if (targetStudentId) {
      try {
        const experimentType = req.body.experiment_type || 'inorganic';

        const { error: logError } = await supabase
          .from('experiment_results')
          .insert({
            user_id: targetStudentId,
            experiment_type: experimentType,
            score: score,
            reaction_id: reaction_id.toString(),
            outcome_label: data.result,
            chem_a: chem_a,
            chem_b: chem_b,
            chem_i: chem_i,
            chem_c: chem_c,
            created_at: new Date().toISOString()
          });

        if (logError) {
          console.error('Failed to log experiment result:', logError.message);
        }
      } catch (logError) {
        console.error('Failed to log experiment:', logError.message);
      }
    }

    return success(res, {
      reaction_id,
      regime: regime || 'NONE',
      outcome_label: data.result || 'Unknown Reaction',
      product_formula: data.product_name || '',
      color: data.color || '#ffffff',
      state_change: stateChange.length > 0 ? stateChange.join(', ') : 'No visible change',
      thermal_effect: thermalEffect,
      ai_tutor_context: data.product_info || data.result || '',
      is_dangerous: isDangerous,
      score: score,
    });

  } catch (err) {
    console.error('[resultController.calculateResult]', err.message);
    return error(res, 'INTERNAL_ERROR', 'An unexpected error occurred. Please try again.', 500);
  }
};
