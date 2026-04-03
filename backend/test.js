import dotenv from 'dotenv'
dotenv.config()

import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

async function test() {
  console.log('Testing Groq with llama-3.3-70b-versatile...')
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: 'Say "Hello from Groq!"' }
      ],
      model: 'llama-3.3-70b-versatile',  // Updated model
    })
    
    console.log('✅ Groq is working!')
    console.log('Response:', completion.choices[0]?.message?.content)
  } catch (error) {
    console.error('❌ Groq error:', error.message)
  }
}

test()