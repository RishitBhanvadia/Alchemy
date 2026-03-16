const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');
const { success, error } = require('../utils/response');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.aiRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'You have reached the limit of 20 AI tutor requests per hour. Please take a break and continue experimenting!' } },
    standardHeaders: true,
    legacyHeaders: false,
});

exports.hintRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Hint service reached its hourly limit.' } },
    standardHeaders: true,
    legacyHeaders: false,
});


exports.explainReaction = async (req, res) => {
    try {
        const { chemicals, reaction_outcome, student_question } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return error(res, 'INTERNAL_ERROR', 'Gemini API key is not configured on the server.', 500);
        }

        if (!student_question || typeof student_question !== 'string') {
            return error(res, 'VALIDATION_ERROR', 'Question is required.', 400);
        }
        if (student_question.length > 500) {
            return error(res, 'VALIDATION_ERROR', 'Question must be under 500 characters.', 400);
        }
        
        const cleanQuestion = student_question.replace(/<[^>]*>/g, '').trim();

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a friendly and encouraging chemistry teacher for school students.
        
        Context:
        The student just mixed: ${JSON.stringify(chemicals)}.
        The reaction produced: ${reaction_outcome}.
        The student asks: "${cleanQuestion}".

Task:
Explain the chemistry behind this reaction in simple language suitable for a school student.
Use analogies if helpful.
Be encouraging and foster curiosity.
Keep the response under 150-200 words.
Ensure the explanation is scientifically accurate but easy to understand.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return success(res, { explanation: text });
    } catch (err) {
        console.error('[explainReaction] Gemini AI error:', err.message);
        return error(res, 'INTERNAL_ERROR', 'The AI Tutor is currently busy. Please try again in a moment.', 500);
    }
};

exports.getHint = async (req, res) => {
    try {
        const { chem_a, chem_b, chem_c, chem_d } = req.query;

        if (!process.env.GEMINI_API_KEY) {
            return error(res, 'INTERNAL_ERROR', 'Gemini API key is not configured.', 500);
        }

        const validateConcentration = (val) => {
            if (val === undefined || val === null || val === '') return true;
            const n = Number(val);
            return !isNaN(n) && n >= 0 && n <= 100;
        };

        if (!validateConcentration(chem_a) || !validateConcentration(chem_b) || 
            !validateConcentration(chem_c) || !validateConcentration(chem_d)) {
            return error(res, 'VALIDATION_ERROR', 'Invalid concentration values. Must be numbers between 0 and 100.', 400);
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a chemistry tutor. A student is about to mix these chemicals (concentrations 0-100):
        Chemical A: ${chem_a}%, Chemical B: ${chem_b}%, Chemical C: ${chem_c}%, Chemical D: ${chem_d}%.
        
        Provide a very short, subtle hint or prediction about what might happen. 
        Keep it to 1 or 2 short sentences max. 
        Example: "Mixing an acid with a base usually creates a salt..."
        If everything is zero, say "Select some chemicals to see a hint."`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return success(res, { hint: text.trim() });
    } catch (err) {
        console.error('[getHint] Gemini AI error:', err.message);
        return error(res, 'INTERNAL_ERROR', 'Hint service unavailable.', 500);
    }
};

