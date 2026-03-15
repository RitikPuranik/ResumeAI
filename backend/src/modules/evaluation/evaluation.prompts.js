export const buildEvaluationPrompt = (interview) => {
  const qas = interview.questions.map((q, i) =>
    `Q${i + 1}: ${q.question}\nAnswer: ${q.answer || 'No answer provided'}`
  ).join('\n\n')

  return `You are an expert interview evaluator.

Role: ${interview.role}
Round Type: ${interview.roundType}

Interview Q&A:
${qas}

Evaluate the candidate and return ONLY a valid JSON object with no extra text or markdown:
{
  "overallScore": <0-100>,
  "breakdown": {
    "technicalKnowledge": <0-10>,
    "communicationClarity": <0-10>,
    "answerCompleteness": <0-10>,
    "confidence": <0-10>
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "perQuestion": [
    { "question": "...", "score": <0-10>, "feedback": "one line feedback" }
  ]
}`
}
