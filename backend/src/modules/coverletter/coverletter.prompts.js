export const coverLetterPrompt = (resume, jobTitle, company, jobDescription, tone) => `
You are a professional career coach writing a cover letter.

Candidate Resume: ${resume}
Job Title: ${jobTitle}
${company ? `Company: ${company}` : 'Company: Not specified'}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
Tone: ${tone}

Rules:
- Exactly 4 paragraphs
- Opening: express genuine interest in the role
- Middle 2: highlight 2-3 specific skills from the resume relevant to the job
- Closing: confident call to action
- No generic filler phrases like "I am a hard worker" or "I am passionate"
- If no company name is provided, use "your company" or "your organization"
- Return plain text only — no markdown, no subject line, no headers
`
