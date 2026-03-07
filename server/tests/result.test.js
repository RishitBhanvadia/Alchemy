const request = require('supertest');
const express = require('express');

// We need to mock supabase query to not fail
const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
};

// Let's modify the last eq to resolve with dummy data
mockSupabase.eq.mockImplementation((field, val) => {
    if (field === 'reaction_id') {
        return Promise.resolve({ data: [{ id: 1 }], error: null });
    }
    return mockSupabase;
});

jest.mock('@supabase/supabase-js', () => ({
    createClient: () => mockSupabase
}));

const { calculateResult } = require('../controllers/resultController');

// Mock the server setup with actual controller
const app = express();
app.use(express.json());

app.get('/result/:chem_a/:chem_b/:chem_c/:chem_d', calculateResult);

describe('calculateResult', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate 0 0 0 0 without returning NaN', async () => {
        const response = await request(app)
            .get('/result/0/0/0/0')
            .expect(200);

        // Check the arguments passed to supabase eq method
        const calls = mockSupabase.eq.mock.calls;

        // Find if any call has NaN
        const hasNaN = calls.some(call => isNaN(call[1]) && typeof call[1] === 'number');
        expect(hasNaN).toBe(false);

        // For A=0, B=0, C=0, D=0 it should send eq('conc_a', 0)
        expect(calls).toContainEqual(['conc_a', 0]);
        expect(calls).toContainEqual(['conc_b', 0]);
        expect(calls).toContainEqual(['conc_c', 0]);
        expect(calls).toContainEqual(['conc_d', 0]);
        expect(calls).toContainEqual(['reaction_id', 0]);
    });
});
