const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Specific rate limiter for AI requests: 20 requests per hour
exports.aiRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 requests
    message: { error: 'You have reached the limit of 20 AI tutor requests per hour. Please take a break and continue experimenting!' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Relaxed rate limiter for hints: 100 requests per hour
exports.hintRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests
    message: { error: 'Hint service reached its hourly limit.' },
    standardHeaders: true,
    legacyHeaders: false,
});


exports.explainReaction = async (req, res) => {
    try {
        const { chemicals, reaction_outcome, student_question } = req.body;

        if (typeof student_question !== 'string' || student_question.length > 500) {
            return res.status(400).json({ error: 'Invalid student question.' });
        }
        if (typeof reaction_outcome !== 'string' || reaction_outcome.length > 500) {
            return res.status(400).json({ error: 'Invalid reaction outcome.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a friendly and encouraging chemistry teacher for school students.
        
Context:
The student just mixed: ${JSON.stringify(chemicals)}.
The reaction produced: ${reaction_outcome}.
The student asks: "${student_question}".

Task:
Explain the chemistry behind this reaction in simple language suitable for a school student.
Use analogies if helpful.
Be encouraging and foster curiosity.
Keep the response under 150-200 words.
Ensure the explanation is scientifically accurate but easy to understand.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ explanation: text });
    } catch (error) {
        console.error('Gemini AI Error:', error);
        res.status(500).json({ error: 'The AI Tutor is currently busy. Please try again in a moment.' });
    }
};

exports.getHint = async (req, res) => {
    try {
        const { chem_a, chem_b, chem_c, chem_d } = req.query;

        const validateConc = (val) => {
            const num = Number(val);
            return !isNaN(num) && num >= 0 && num <= 100;
        };

        if (!validateConc(chem_a) || !validateConc(chem_b) || !validateConc(chem_c) || !validateConc(chem_d)) {
            return res.status(400).json({ error: 'Invalid chemical concentrations.' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key is not configured.' });
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

        res.json({ hint: text.trim() });
    } catch (error) {
        console.error('Gemini AI Hint Error:', error);
        res.status(500).json({ error: 'Hint service unavailable.' });
    }
};

