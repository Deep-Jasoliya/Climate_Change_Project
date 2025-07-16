const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTip(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' }); 
    const result = await model.generateContent([prompt]); 
    const response = await result.response;
    return response.text().trim();
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return null;
  }
}

module.exports = generateTip;
