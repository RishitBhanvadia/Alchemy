
const axios = require('axios');

const testReaction = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_a: 70,
      chem_b: 0,
      chem_i: 0,
      chem_c: 30
    });
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.outcome_label === 'Catalytic Acid Oxidation — Chlorine Gas Trace' && response.data.is_dangerous === true) {
      console.log('SUCCESS: Iteration 7 verified.');
    } else {
      console.log('FAILURE: Response does not match expected output.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Error Data:', error.response.data);
    }
  }
};

testReaction();
