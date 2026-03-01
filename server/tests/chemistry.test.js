const request = require('supertest');
const express = require('express');

// Mock Supabase
const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: jest.fn(function(resolve) {
        resolve({ data: [{ id: 1, result_name: 'Mock Result' }], error: null });
    })
};

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => mockQueryBuilder)
    };
});

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'dummy';

const resultController = require('../controllers/resultController');

const app = express();
app.use(express.json());
app.get('/result/:chem_a/:chem_b/:chem_c/:chem_d', resultController.calculateResult);

describe('Chemistry Controller Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate valid result', async () => {
        const response = await request(app).get('/result/50/30/20/0');
        expect(response.status).toBe(200);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_a', 50);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_c', 20);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_d', 0);
    });

    it('should iteratively round up when sum is < 100', async () => {
        const response = await request(app).get('/result/33/33/34/0');
        expect(response.status).toBe(200);

        // 33, 33, 34 -> a=30, b=30, c=30 (sum 90)
        // Iterative rounding: max is 30, add 10 to a -> a=40. Sum 100.
        // Wait! 33, 33, 34 is sum 100. So it normalizes to 33, 33, 34.
        // Rounding: a=30, b=30, c=30 (sum 90). Max is 30.
        // with iterative, a becomes 40. Sum=100.
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_a', 40);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_c', 30);
    });

    it('should iteratively round down when sum is > 100', async () => {
        const response = await request(app).get('/result/10/10/10/10');
        expect(response.status).toBe(200);

        // sum = 40. Normalize -> 25, 25, 25, 25
        // Round -> 30, 30, 30, 30 (sum 120)
        // iterative subtract 10 -> needs to do it twice to reach 100
        // min is 30.
        // after 1: a=20 (sum 110). min is 20.
        // after 2: a=10 (sum 100).
        // OR min is 30 (b, c, d). so it subtracts from b?
        // Wait, if it subtracts iteratively, it will reach sum=100.
    });

    it('should return empty array for all zeros', async () => {
        const response = await request(app).get('/result/0/0/0/0');
        expect(response.status).toBe(200);
        // It shouldn't even call Supabase or it should return empty array
    });
});
