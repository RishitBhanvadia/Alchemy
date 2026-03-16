const axios = require('axios');

const testIteration15 = async () => {
  try {
    // Test: Full mixture of all four chemicals (A + B + I + C)
    // Expected reaction_id: 1 + 10 + 100 + 1000 = 1111
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_a: 25,
      chem_b: 25,
      chem_c: 25,  // Catalyst → maps to 100 (conc_c in data)
      chem_i: 25   // Indicator → maps to 1000 (conc_d in data)
    });

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    const { outcome_label, color, reaction_id, regime, is_dangerous } = response.data;

    // Verify reaction_id is 1111 (full mixture)
    const success = 
      reaction_id === 1111 &&
      outcome_label.includes('HCl') &&
      outcome_label.includes('NaCl') &&
      outcome_label.includes('CuSO4') &&
      outcome_label.includes('FeSO4');

    if (success) {
      console.log('✅ Iteration 15 Passed!');
    } else {
      console.log('❌ Iteration 15 Failed!');
      console.log('Expected reaction_id: 1111, got:', reaction_id);
      console.log('Expected outcome to contain all chemicals, got:', outcome_label);
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testIteration15();
