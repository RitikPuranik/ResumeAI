import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Returns a Gemini 2.0 Flash model instance
 * Free tier: 1,500 requests/day, 1M tokens/minute
 */
export const getGeminiModel = () => genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

/**
 * Helper - send a prompt and get back plain text
 */
export const geminiGenerate = async (prompt) => {
  const model = getGeminiModel()
  const result = await model.generateContent(prompt)
  return result.response.text()
}

/**
 * Helper - send a prompt and get back parsed JSON
 * Strips markdown code fences if Gemini wraps the response
 */
export const geminiGenerateJSON = async (prompt) => {
  const text = await geminiGenerate(prompt)
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
