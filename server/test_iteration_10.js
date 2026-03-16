const axios = require('axios');

async function testIteration10() {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_i: 60,
      chem_c: 40
    });
    console.log('Iteration 10 Test Result:', JSON.stringify(response.data, null, 2));
    
    if (response.data.reaction_id === 1100 && response.data.outcome_label === 'Catalytic Indicator Bleaching') {
      console.log('SUCCESS: Iteration 10 verified.');
    } else {
      console.error('FAILURE: Iteration 10 verification failed.');
    }
  } catch (error) {
    console.error('Error during test:', error.response ? error.response.data : error.message);
  }
}

testIteration10();
