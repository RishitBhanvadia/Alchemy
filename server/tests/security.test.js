const request = require('supertest');
const app = require('../server');

describe('Security Configuration', () => {
    it('should have trust proxy enabled', () => {
        expect(app.get('trust proxy')).toBe(1);
    });

    it('should reject urlencoded payload > 10mb', async () => {
        // Create a large string > 10MB
        const largeString = 'x'.repeat(10.5 * 1024 * 1024);

        await request(app)
            .post('/health') // Using POST to send body
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(`data=${largeString}`)
            .expect(413); // Payload Too Large
    }, 20000); // Increase timeout for large payload

    it('should accept urlencoded payload < 10mb', async () => {
        const smallString = 'x'.repeat(1 * 1024 * 1024); // 1MB

        // POST to /health (which is GET-only) should return 404 (Not Found)
        // If the body size was too large, it would return 413.
        // So 404 confirms that body-parser accepted the payload and passed control to the route handler (which didn't match POST).
        await request(app)
            .post('/health')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(`data=${smallString}`)
            .expect(404);
    });

    it('should have rate limiting headers', async () => {
        const res = await request(app).get('/health');
        expect(res.headers).toHaveProperty('ratelimit-limit');
        expect(res.headers).toHaveProperty('ratelimit-remaining');
        // The limit is set to 100
        expect(res.headers['ratelimit-limit']).toBe('100');
    });

    it('should not log query parameters', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        await request(app).get('/health?secret=12345');

        // Check calls to find the log entry
        const logCall = consoleSpy.mock.calls.find(call => call[0].includes('GET /health 200'));
        expect(logCall).toBeDefined();
        expect(logCall[0]).not.toContain('secret=12345');

        consoleSpy.mockRestore();
    });
});
