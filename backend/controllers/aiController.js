import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are an intelligent AI assistant embedded in "RELAX digital" — a modern full-stack web platform for admins and consumers.

About the platform:
- Admins can manage users, products (CRUD), orders, view revenue analytics, and configure store settings.
- Users (customers) can browse products, manage their cart, place orders, and track order history.
- Authentication uses JWT + bcrypt with role-based access control (Admin / User portals).
- Built with React (Vite + Tailwind), Node.js/Express, MongoDB.

Your role:
- Answer questions about the platform features, navigation, and how things work.
- Help admins understand their dashboard, manage data, and interpret analytics.
- Help users with orders, products, account settings, and general support.
- Be concise, friendly, and professional. Use bullet points when listing multiple items.
- If asked about something outside the platform, you can still help as a general AI assistant.
- Never reveal passwords, internal secrets, or sensitive system data.

Always respond in a helpful, conversational tone. Keep responses focused and under 200 words unless detail is genuinely needed.`;

/**
 * POST /api/ai/chat
 * Body: { messages: [{ role: 'user'|'model', parts: [{ text: string }] }] }
 */
export const chatWithGemini = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI service is not configured. Please set GEMINI_API_KEY in the backend .env file.',
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: messages array is required.',
      });
    }

    // Build the conversation payload for Gemini
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }],
    }));

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[AI] Gemini API error:', response.status, errorData);
      return res.status(502).json({
        success: false,
        message: errorData?.error?.message || 'Failed to get response from Gemini API.',
      });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({
        success: false,
        message: 'No response generated. The content may have been blocked by safety filters.',
      });
    }

    res.status(200).json({
      success: true,
      reply: text,
      model: GEMINI_MODEL,
    });
  } catch (error) {
    console.error('[AI] Unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while processing AI request.',
    });
  }
};
