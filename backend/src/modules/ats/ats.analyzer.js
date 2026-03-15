export const atsAnalysisPrompt = (resumeText) => `
You are an expert ATS (Applicant Tracking System) analyzer.

Analyze this resume and return ONLY a valid JSON object with absolutely no extra text or markdown:

Resume:
${resumeText}

Return this exact JSON structure:
{
  "score": <number 0-100>,
  "keywordScore": <number 0-100>,
  "formattingScore": <number 0-100>,
  "completenessScore": <number 0-100>,
  "lengthScore": <number 0-100>,
  "matchedKeywords": ["array of strong keywords found"],
  "missingSections": ["any important missing sections"],
  "suggestions": ["actionable improvement tips"],
  "verdict": "one line summary of the resume quality"
}
`
