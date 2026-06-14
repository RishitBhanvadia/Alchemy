if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const validateEnv = require('./config/validateEnv');
if (require.main === module) { validateEnv(); }

const express = require('express');
const bodyParser = require("body-parser");
const resultRoutes = require('./routes/resultRoutes');
const titrationRoutes = require('./routes/titrationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const experimentRoutes = require('./routes/experimentRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const profileRoutes = require('./routes/profileRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', 1); // trust first proxy for rate limiting behind reverse proxies
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' } }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please wait 15 minutes.' } }
});

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'AI rate limit reached. Please wait before asking more questions.' } }
});

app.use('/api', generalLimiter);

// Security Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
            ],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: [
                "'self'",
                "https://*.supabase.co",
                "wss://*.supabase.co",
                "https://generativelanguage.googleapis.com",
            ],
            workerSrc: ["'self'", "blob:"],
            wasmSrc: ["'self'", "blob:"],
        },
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    hsts: process.env.NODE_ENV === 'production'
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
];
if (process.env.FRONTEND_URL) {
    const urls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
    allowedOrigins.push(...urls);
}

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // allow local config + dynamic vercel preview URLs
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        
        console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    maxAge: 86400,
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly with the same config
app.options('*', cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

// Request Logger with Response Status
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`, {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
        });
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

const { requireAuth, requireRole } = require('./middleware/authMiddleware');

// Routes

// Authenticated routes
app.use('/api/results', requireAuth, resultRoutes);
app.use('/api/titration', requireAuth, titrationRoutes);
app.use('/api/ai', requireAuth, aiRoutes);
app.use('/api/experiments', requireAuth, experimentRoutes);

// Role-specific routes
app.use('/api/classroom', requireAuth, requireRole('teacher'), classroomRoutes);
app.use('/api/teacher', requireAuth, requireRole('teacher'), teacherRoutes);
app.use('/api/student', requireAuth, requireRole('student'), experimentRoutes);
app.use('/api/auth', requireAuth, profileRoutes);

// Meeting routes (auth middleware applied inside the router per-route)
app.use('/api/meetings', meetingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (res.headersSent) return next(err);

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    }
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
  // Force close after 10 seconds
  setTimeout(() => process.exit(1), 10000);
});

process.on('SIGINT', () => process.emit('SIGTERM'));

// Handle unhandled Promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason?.toString() });
});}
module.exports = app;
