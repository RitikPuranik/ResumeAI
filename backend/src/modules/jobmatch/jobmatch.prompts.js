export const jobMatchPrompt = (resumeText, jobDescription) => `
You are a hiring expert and ATS specialist.

Resume:
${resumeText}

Job Description:
${jobDescription}

Analyze and return ONLY a valid JSON object with no extra text or markdown:
{
  "matchScore": <0-100>,
  "matchedKeywords": ["keywords found in both resume and JD"],
  "missingKeywords": ["important keywords in JD missing from resume"],
  "suggestions": ["specific actionable tips to improve the match"],
  "verdict": "one line summary of match quality"
}
`
