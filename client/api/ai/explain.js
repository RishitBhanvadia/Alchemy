import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chemicals, reaction_outcome, student_question } = req.body;

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
}
