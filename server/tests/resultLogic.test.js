const request = require('supertest');
const express = require('express');
const resultController = require('../controllers/resultController');
const { computeReactionId } = require('../utils/reactionHash');
const { classifyRegime } = require('../utils/regimeClassifier');

const app = express();
app.use(express.json());
app.post('/api/results', resultController.calculateResult);

// Mock supabase
jest.mock('../supabaseClient', () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: { outcome_label: 'Mocked Result' } }),
    single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } }),
}));

describe('LogicGuard - resultController logic matches utils', () => {
    it('should compute reactionId using the same logic as utils/reactionHash', async () => {
        const response = await request(app)
            .post('/api/results')
            .send({ chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 });

        // If inline computeReactionId is used: i -> 100
        // If utils/reactionHash computeReactionId is used: i -> 1000
        expect(response.body.reaction_id).toBe(1000);
    });

    it('should compute regime using the same logic as utils/regimeClassifier', async () => {
        const response = await request(app)
            .post('/api/results')
            .send({ chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 });

        // Inline classifyRegime only uses a, b -> NEUTRAL
        // utils classifyRegime handles Indicator dominance -> INDICATOR_DOMINANT
        expect(response.body.regime).toBe('INDICATOR_DOMINANT');
    });
});
