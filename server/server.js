require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const resultRoutes = require('./routes/resultRoutes');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
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
            // Note: 'unsafe-inline' is required for Vite during development/build
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
// Restrict CORS to specific origins to prevent unauthorized cross-origin access
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Limit request payloads to 1mb to prevent DOS attacks via memory exhaustion
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Connected to server on port ${PORT}`);
    console.log("Environment Check:");
    console.log("- Supabase URL exists:", !!process.env.SUPABASE_URL);
    console.log("- Supabase Key exists:", !!process.env.SUPABASE_KEY);
});