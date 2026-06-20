const supabase = require('../supabaseClient');
const logger = require('../utils/logger');

function computeReactionId(a, b, i, c) {
  const THRESHOLD = 5; // Lower threshold (5%) for fuzzy matching
  let id = 0;
  if (a >= THRESHOLD) id += 1;
  if (b >= THRESHOLD) id += 10;
  if (i >= THRESHOLD) id += 100;
  if (c >= THRESHOLD) id += 1000;
  return id;
}

function normalise(a, b, i, c) {
  const total = Number(a) + Number(b) + Number(i) + Number(c);
  if (total < 1) return null; // Too dilute to calculate
  const na = Math.round((a / total) * 100);
  const nb = Math.round((b / total) * 100);
  const ni = Math.round((i / total) * 100);
  const nc = Math.round((c / total) * 100);

  const arr = [na, nb, ni, nc];
  let sum = na + nb + ni + nc;

  if (sum !== 100) {
      const diff = 100 - sum;
      let maxIdx = 0;
      let maxVal = arr[0];
      for (let j = 1; j < 4; j++) {
          if (arr[j] > maxVal) {
              maxVal = arr[j];
              maxIdx = j;
          }
      }
      arr[maxIdx] += diff;
  }
  return arr;
}

function classifyRegime(a, b) {
  const total = a + b;
  if (total < 5) return 'NEUTRAL'; // Too little to differentiate
  const ratio = a / total;
  if (ratio > 0.60) return 'ACID_DOMINANT';
  if (ratio < 0.40) return 'BASE_DOMINANT';
  return 'NEUTRAL';
}

exports.calculateResult = async (req, res) => {
  try {
    // Parse input — accept both naming conventions
    const chem_a = Number(req.body.chem_a ?? req.body.chemA ?? 0);
    const chem_b = Number(req.body.chem_b ?? req.body.chemB ?? 0);
    const chem_i = Number(req.body.chem_i ?? req.body.chemI ?? 0);
    const chem_c = Number(req.body.chem_c ?? req.body.chemC ?? 0);

    // Validate
    if ([chem_a, chem_b, chem_i, chem_c].some(n => isNaN(n) || n < 0 || n > 100)) {
      return res.status(400).json({
        error: 'Invalid concentration values. Each must be a number between 0 and 100.'
      });
    }

    // Normalise
    const normalised = normalise(chem_a, chem_b, chem_i, chem_c);
    const [na, nb, ni, nc] = normalised || [0, 0, 0, 0];

    // Compute lookup keys
    const reaction_id = computeReactionId(na, nb, ni, nc);
    const regime = classifyRegime(na, nb);

    // Query — try exact regime match first
    let { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('reaction_id', reaction_id)
      .eq('regime', regime)
      .maybeSingle();

    // Fallback — try any regime for this reaction_id
    if (!data) {
      const fallback = await supabase
        .from('results')
        .select('*')
        .eq('reaction_id', reaction_id)
        .limit(1)
        .maybeSingle();
      data = fallback.data;
    }

    // Final Fallback — Algorithmic Result based on chemicalMatrix.json
    if (!data) {
        try {
            const matrix = require('../data/chemicalMatrix.json');
            // Simple rule: Acid + Base = Neutralization
            if (na > 15 && nb > 15) {
                const pattern = matrix.reaction_patterns.find(p => p.name === 'Neutralization');
                data = {
                    outcome_label: `Algorithmic ${pattern.name}`,
                    product_formula: 'NaCl + H2O',
                    color: regime === 'NEUTRAL' ? 'Green (BTB)' : (regime === 'ACID_DOMINANT' ? 'Yellow (Acidic)' : 'Blue (Basic)'),
                    state_change: 'Mixed solution',
                    thermal_effect: 'Slightly Exothermic',
                    ai_tutor_context: 'This reaction was calculated dynamically based on chemical reactivity rules.',
                    is_dangerous: false
                };
            }
        } catch (e) {
            logger.error('Algorithmic calculation failed', e);
        }
    }

    // Last Resort — Water (ID 0)
    if (!data) {
      const { data: water } = await supabase
        .from('results')
        .select('*')
        .eq('reaction_id', 0)
        .single();
      data = water;
    }

    logger.info('Reaction calculated', { reaction_id, regime, outcome: data.outcome_label });

    // Return result
    return res.status(200).json({
      reaction_id,
      regime,
      outcome_label:    data.outcome_label,
      product_formula:  data.product_formula  || '',
      color:            data.color            || 'Colourless',
      state_change:     data.state_change     || 'None',
      thermal_effect:   data.thermal_effect   || 'None',
      ai_tutor_context: data.ai_tutor_context || '',
      is_dangerous:     data.is_dangerous     || false,
    });

  } catch (err) {
    logger.error('Reaction calculation failed', { error: err.message });
    return res.status(500).json({ error: 'Server error during calculation.' });
  }
};
