import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chem_a, chem_b, chem_c, chem_d } = req.query;

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
}
