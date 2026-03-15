import { geminiGenerateJSON } from '../../config/gemini.js'

export const generateQuestions = async (role, roundType) => {
  const prompt = `Generate 7 interview questions for a ${role} position.
Round type: ${roundType}
- technical: focus on coding, system design, technical concepts
- hr: focus on behavior, culture fit, career goals  
- mixed: balanced mix of technical and behavioral

Return ONLY a valid JSON object with no extra text or markdown:
{
  "questions": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?", "Question 6?", "Question 7?"]
}
`
  const data = await geminiGenerateJSON(prompt)
  return data.questions
}
