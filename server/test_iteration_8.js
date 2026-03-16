
const axios = require('axios');

const testReaction = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_a: 0,
      chem_b: 60,
      chem_i: 40,
      chem_c: 0
    });
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.color === 'Blue' && response.data.outcome_label === 'Base-Indicator Response — Blue') {
      console.log('SUCCESS: Iteration 8 verified.');
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
