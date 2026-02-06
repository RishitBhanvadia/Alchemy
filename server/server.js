require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const resultRoutes = require('./routes/resultRoutes');
const cors = require('cors'); // Adding CORS as it was in package.json and is good practice

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

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/result', resultRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Connected to server on port ${PORT}`);
    console.log("Environment Check:");
    console.log("- Supabase URL exists:", !!process.env.SUPABASE_URL);
    console.log("- Supabase Key exists:", !!process.env.SUPABASE_KEY);
});