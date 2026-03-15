import JobMatch from './jobmatch.model.js'
import Resume from '../resume/resume.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { jobMatchPrompt } from './jobmatch.prompts.js'
import { geminiGenerateJSON } from '../../config/gemini.js'

export const analyzeMatchService = async (userId, { resumeId, jobDescription }) => {
  if (!resumeId || !jobDescription) throw new ApiError(400, 'resumeId and jobDescription are required')

  const resume = await Resume.findOne({ _id: resumeId, user: userId })
  if (!resume) throw new ApiError(404, 'Resume not found')

  const data = await geminiGenerateJSON(jobMatchPrompt(JSON.stringify(resume), jobDescription))

  return await JobMatch.create({
    user: userId,
    resume: resumeId,
    jobDescription,
    ...data,
  })
}

export const getMatchHistoryService = async (userId) => {
  return await JobMatch.find({ user: userId }).sort({ createdAt: -1 })
}
