const supabase = require('../supabaseClient');

function computeReactionId(a, b, i, c) {
  const THRESHOLD = 10;
  let id = 0;
  if (a >= THRESHOLD) id += 1;
  if (b >= THRESHOLD) id += 10;
  if (i >= THRESHOLD) id += 100;
  if (c >= THRESHOLD) id += 1000;
  return id;
}

function normalise(a, b, i, c) {
  const total = Number(a) + Number(b) + Number(i) + Number(c);
  if (total === 0) return null;
  const na = Math.round((a / total) * 100);
  const nb = Math.round((b / total) * 100);
  const ni = Math.round((i / total) * 100);
  const nc = 100 - na - nb - ni;
  return [na, nb, ni, Math.max(0, nc)];
}

function classifyRegime(a, b) {
  const total = a + b;
  if (total === 0) return 'NEUTRAL';
  const ratio = a / total;
  if (ratio > 0.65) return 'ACID_DOMINANT';
  if (ratio < 0.35) return 'BASE_DOMINANT';
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
    if (!normalised) {
      return res.status(400).json({ error: 'All chemicals are at 0%.' });
    }
    const [na, nb, ni, nc] = normalised;

    // Compute lookup keys
    const reaction_id = computeReactionId(na, nb, ni, nc);
    const regime = classifyRegime(na, nb);

    // Query — try exact regime match first
    let { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('reaction_id', reaction_id)
      .eq('regime', regime)
      .maybeSingle(); // use maybeSingle — returns null instead of error if no row found

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

    if (!data) {
      return res.status(404).json({
        error: `No reaction found for combination ID ${reaction_id} (regime: ${regime}).`
      });
    }

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
    console.error('[resultController.calculateResult] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Server error during reaction calculation.' });
  }
};
