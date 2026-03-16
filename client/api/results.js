import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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

function computeReactionId(chemA, chemB, chemI, chemC, PRESENCE_THRESHOLD = 5) {
  const chemicals = [
    { key: 'A', val: chemA },
    { key: 'B', val: chemB },
    { key: 'I', val: chemI },
    { key: 'C', val: chemC }
  ];
  
  const active = chemicals
    .filter(c => c.val >= PRESENCE_THRESHOLD)
    .sort((a, b) => b.val - a.val);
  
  if (active.length < 2) return 0;
  
  const hash = active.reduce((acc, c, i) => {
    return acc + (c.key.charCodeAt(0) * (i + 1) * Math.round(c.val / 10));
  }, 0);
  
  return hash % 1000;
}

function classifyRegime(chemA, chemB, chemI, chemC) {
  const max = Math.max(chemA, chemB, chemI, chemC);
  const sum = chemA + chemB + chemI + chemC;
  
  if (sum === 0) return 'EMPTY';
  if (chemA >= 60 && chemA >= max) return 'ACID_DOMINANT';
  if (chemB >= 60 && chemB >= max) return 'BASE_DOMINANT';
  if (chemI >= 60 && chemI >= max) return 'INDICATOR_DOMINANT';
  if (chemC >= 60 && chemC >= max) return 'CATALYST_DOMINANT';
  
  if (chemA > 30 && chemB > 30) return 'ACID_BASE_BALANCED';
  if (chemI > 30 && (chemA > 20 || chemB > 20)) return 'INDICATOR_ACTIVE';
  
  return 'MIXED';
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { chem_a = 0, chem_b = 0, chem_c = 0, chem_d = 0, chem_i, student_id } = req.body;
    
    chem_i = chem_i || chem_d || 0;

    const total = chem_a + chem_b + chem_i + chem_c;
    if (total === 0) return res.status(400).json({ error: 'All chemicals are at 0%.' });

    chem_a = Math.round((chem_a / total) * 100);
    chem_b = Math.round((chem_b / total) * 100);
    chem_i = Math.round((chem_i / total) * 100);
    chem_c = 100 - chem_a - chem_b - chem_i;

    const reaction_id = computeReactionId(chem_a, chem_b, chem_i, chem_c);
    if (reaction_id === 0) return res.status(400).json({ error: 'No active chemicals detected above threshold.' });

    const regime = classifyRegime(chem_a, chem_b, chem_i, chem_c);

    let { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('reaction_id', reaction_id)
      .limit(1)
      .single();

    if (!data) {
      return res.status(404).json({ error: `No reaction found for combination ID ${reaction_id}.` });
    }

    const stateChange = [];
    if (data.solid) stateChange.push('Precipitate');
    if (data.gas) stateChange.push('Gas Evolution');
    if (data.solid && data.solid_color) stateChange.push(`Solid Color: ${data.solid_color}`);
    
    const thermalEffect = deriveThermalEffect(data.result, data.gas, data.solid);
    const isDangerous = determineDanger(data.result, data.gas);
    
    const score = calculateScore(chem_a, chem_b, chem_i, chem_c, data.result);

    const targetStudentId = student_id || req.body.student_id;
    if (targetStudentId) {
      try {
        const experimentType = req.body.experiment_type || 'inorganic';

        const { error: insertError } = await supabase
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

        if (insertError) {
          console.error('Failed to insert experiment result:', insertError);
        }
      } catch (logError) {
        console.error('Failed to log experiment:', logError);
      }
    }

    res.json({
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
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error during reaction calculation.' });
  }
}
