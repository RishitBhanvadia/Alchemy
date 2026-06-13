function classifyRegime(chem_a, chem_b, chem_i = 0, chem_c = 0) {
  const acidBaseSum = chem_a + chem_b;

  // Handle Catalyst dominance (C present, A+B minimal)
  if (chem_c > 20 && acidBaseSum < 20) {
    return 'CATALYST_DOMINANT';
  }
  
  // Handle Indicator dominance (I present, others minimal)
  if (chem_i > 30 && acidBaseSum < 20 && chem_c < 20) {
    return 'INDICATOR_DOMINANT';
  }

  // Handle Acid-Base dominance (A+B combinations)
  if (acidBaseSum > 0) {
    const ratio = chem_a / acidBaseSum;
    if (ratio > 0.65) return 'ACID_DOMINANT';
    if (ratio < 0.35) return 'BASE_DOMINANT';
    return 'NEUTRAL';
  }
  
  return 'NONE';
}

module.exports = { classifyRegime };
