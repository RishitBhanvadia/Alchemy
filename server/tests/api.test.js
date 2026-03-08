const request = require('supertest');
const express = require('express');
const resultRoutes = require('../routes/resultRoutes');

jest.mock('@supabase/supabase-js', () => {
    const mockEq = jest.fn();
    const eqChain = { eq: mockEq };
    mockEq.mockReturnValue(eqChain);

    // allow await on the last eq
    eqChain.then = function(resolve, reject) {
        resolve({ data: [{ result_name: 'Success' }], error: null });
    };

    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => ({
                select: jest.fn(() => ({
                    eq: mockEq
                }))
            }))
        }))
    };
});

// Create the app and use the real routes to test the controller logic
const app = express();
app.use(express.json());

// Set dummy env vars for supabase url and key
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'dummy-key';

// Apply routes
app.use('/result', resultRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

describe('API Endpoints', () => {
    describe('GET /result/:a/:b/:c/:d', () => {
        it('should return result for valid parameters', async () => {
            const response = await request(app)
                .get('/result/50/30/20/0')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('result_name');
        });

        it('should return 400 for invalid parameters', async () => {
            await request(app)
                .get('/result/abc/30/20/0')
                .expect(400);
        });

        it('should handle all zero concentrations', async () => {
            const response = await request(app)
                .get('/result/0/0/0/0')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });

        it('should handle maximum concentrations', async () => {
            const response = await request(app)
                .get('/result/100/100/100/100')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
        });
    });
});
