require('dotenv').config();
const express = require('express');
const resultRoutes = require('./routes/resultRoutes');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security: Enable trust proxy for correct IP handling behind load balancers (e.g. Render/Heroku)
// This ensures the rate limiter works correctly and doesn't block all users globally.
app.set('trust proxy', 1);

const rateLimit = require('express-rate-limit');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Security Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Middleware
app.use(cors());
// Removed body-parser middleware as no POST routes exist and large body limits pose a DoS risk.
// If JSON parsing is needed in future, use express.json({ limit: '10kb' }).

// Request Logger with Response Status
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Health Check & Root Route
app.get('/', (req, res) => {
    res.status(200).send("Alchemy Backend is Active 🧪");
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/result', resultRoutes);

const PORT = process.env.PORT || 5000;

// Export app for testing and ensure server only starts if run directly
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Connected to server on port ${PORT}`);
        console.log("Environment Check:");
        console.log("- Supabase URL exists:", !!process.env.SUPABASE_URL);
        console.log("- Supabase Key exists:", !!process.env.SUPABASE_KEY);
    });
}

module.exports = app;
