/* eslint-disable react/prop-types */
/* eslint-disable no-console */
const REACTION_COLOURS = {
  'Colourless': '#E8F4FD',
  'Yellow': '#F5E642',
  'Blue': '#2563EB',
  'Green': '#16A34A',
  'Grey-Green': '#6B7C6E',
  'Red': '#DC2626',
  'Brown-Tinged': '#92400E',
  'Dark Brown': '#451A03',
  'Pale Yellow-Green': '#D4E88A',
  'Yellow fading to Colourless': '#F5E642',
  'Blue fading to Brown': '#60A5FA',
  'Blue-Brown Murky': '#374151',
  'Grey-Green transitioning to Colourless': '#9CA3AF',
  'Yellow-Green with Bubbles': '#A3C441',
  'Pale Blue': '#93C5FD',
  'Dark Green': '#14532D',
  'Orange': '#F97316',
  'Purple': '#7C3AED',
  'Pink': '#EC4899',
  'White': '#FFFFFF',
  'Black': '#000000',
};

export function getReactionColour(colourName) {
  if (!colourName) return REACTION_COLOURS['Colourless'];
  return REACTION_COLOURS[colourName] || '#E8F4FD';
}

export function getReactionParticleColor(reactionResult) {
  if (!reactionResult) return '#ffffff';
  
  const stateChange = reactionResult.state_change || '';
  const thermal = reactionResult.thermal_effect || '';
  
  if (thermal.includes('Exothermic')) return '#FF6B35';
  if (thermal.includes('Endothermic')) return '#60A5FA';
  if (stateChange.includes('Gas')) return '#ffffff';
  if (stateChange.includes('Precipitate')) {
    return reactionResult.color === 'White' ? '#FFFFFF' : '#F5E642';
  }
  
  return '#ffffff';
}

export default { getReactionColour, getReactionParticleColor };
