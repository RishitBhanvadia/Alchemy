const PRESENCE_THRESHOLD = 10; // A chemical must be >= 10% to be "active"

function computeReactionId(chem_a, chem_b, chem_i, chem_c) {
  let id = 0;
  if (chem_a >= PRESENCE_THRESHOLD) id += 1;   // Acid (matches conc_a in data)
  if (chem_b >= PRESENCE_THRESHOLD) id += 10;  // Base (matches conc_b in data)
  if (chem_c >= PRESENCE_THRESHOLD) id += 100; // Catalyst (matches conc_c in data = 100)
  if (chem_i >= PRESENCE_THRESHOLD) id += 1000; // Indicator (matches conc_d in data = 1000)
  return id;
}

module.exports = { computeReactionId, PRESENCE_THRESHOLD };
