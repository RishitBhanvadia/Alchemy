const request = require('supertest');
const express = require('express');

// Mock the server setup
const app = express();
app.use(express.json());

// Mock result route
app.get('/result/:chem_a/:chem_b/:chem_c/:chem_d', (req, res) => {
    const { chem_a, chem_b, chem_c, chem_d } = req.params;

    // Validate parameters
    if (isNaN(chem_a) || isNaN(chem_b) || isNaN(chem_c) || isNaN(chem_d)) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }

    // Mock successful response
    res.json([{
        id: 1,
        conc_a: parseInt(chem_a),
        conc_b: parseInt(chem_b),
        conc_c: parseInt(chem_c),
        conc_d: parseInt(chem_d),
        result_name: 'Test Result'
    }]);
});

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
