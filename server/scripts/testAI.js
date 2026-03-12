const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function debugModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('--- Debugging Gemini API Model Access ---');
    
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The listModels method is typically used to see what models your key can access
        // However, in some SDK versions, it might be different.
        // Let's try to fetch it via the helper if available or just try a generic discovery.
        
        console.log('Sending a discovery request...');
        // If 1.5 flash, pro, and 1.0 pro all 404, there's a fundamental configuration issue.
        
        // One last attempt with the most basic possible call.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
        const result = await model.generateContent("test");
        console.log("Success with gemini-pro!");
    } catch (e) {
        console.log('Error Code:', e.status);
        console.log('Error Message:', e.message);
        if (e.message.includes('API_KEY_INVALID')) {
            console.log('FIX: Your API key is invalid. Please double check the key.');
        } else if (e.status === 404) {
            console.log('FIX: The model was not found. This usually means the Generative AI API is not enabled for this key in Google AI Studio.');
        } else if (e.status === 403) {
            console.log('FIX: Permission denied. Your API key might be restricted to certain services or IP addresses.');
        }
    }
}

debugModels();
