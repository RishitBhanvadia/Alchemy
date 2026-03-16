const axios = require('axios');

async function testIteration9() {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_b: 70,
      chem_c: 30
    });
    console.log('Iteration 9 Test Result:', JSON.stringify(response.data, null, 2));
    
    if (response.data.reaction_id === 1010 && response.data.outcome_label === 'Catalysed Base — Manganese Complex Formation') {
      console.log('SUCCESS: Iteration 9 verified.');
    } else {
      console.error('FAILURE: Iteration 9 verification failed.');
    }
  } catch (error) {
    console.error('Error during test:', error.response ? error.response.data : error.message);
  }
}

testIteration9();
