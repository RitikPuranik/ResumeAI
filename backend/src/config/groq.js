import dotenv from 'dotenv'
dotenv.config()

import Groq from 'groq-sdk'

console.log('[Groq Config] Initializing...')
console.log('[Groq Config] API Key exists:', !!process.env.GROQ_API_KEY)

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables')
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

console.log('[Groq Config] ✅ Groq client initialized')

// Updated working models (as of 2026)
export const getGroqModel = () => {
  // Try these models in order - all are currently supported
  return 'llama-3.3-70b-versatile'  // Best for complex tasks
  // Alternatives: 'llama-3.1-8b-instant', 'gemma2-9b-it', 'mixtral-8x7b-v0.1'
}

export const groqGenerate = async (prompt) => {
  console.log('[Groq] Generating for prompt:', prompt.substring(0, 50))
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interviewer. Generate realistic interview questions and provide helpful feedback. Return ONLY valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: getGroqModel(),
      temperature: 0.7,
      max_tokens: 1024,
    })

    const response = completion.choices[0]?.message?.content || ''
    console.log('[Groq] Response received, length:', response.length)
    return response
  } catch (error) {
    console.error('[Groq] API error:', error)
    throw new Error(`Groq generation failed: ${error.message}`)
  }
}

export const groqGenerateJSON = async (prompt) => {
  const text = await groqGenerate(prompt)
  
  const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('Failed to parse JSON:', text)
      throw new Error('Invalid JSON response from Groq')
    }
  }
  
  try {
    return JSON.parse(text)
  } catch (e) {
    console.error('No JSON found in response:', text)
    throw new Error('No JSON found in Groq response')
  }
}

export default groq