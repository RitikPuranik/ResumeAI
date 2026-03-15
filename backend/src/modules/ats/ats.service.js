import pdfParse from 'pdf-parse'
import AtsResult from './ats.model.js'
import Resume from '../resume/resume.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { atsAnalysisPrompt } from './ats.analyzer.js'
import { geminiGenerateJSON } from '../../config/gemini.js'

export const analyzeResumeService = async (userId, resumeId, file) => {
  let resumeText = ''

  if (file) {
    const parsed = await pdfParse(file.buffer)
    resumeText = parsed.text
  } else if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, user: userId })
    if (!resume) throw new ApiError(404, 'Resume not found')
    resumeText = JSON.stringify(resume)
  } else {
    throw new ApiError(400, 'Provide a resume file or resumeId')
  }

  const data = await geminiGenerateJSON(atsAnalysisPrompt(resumeText))

  const result = await AtsResult.create({
    user: userId,
    resume: resumeId || null,
    score: data.score,
    analysis: data,
  })

  if (resumeId) {
    await Resume.findByIdAndUpdate(resumeId, { atsScore: data.score })
  }

  return result
}

export const getAtsHistoryService = async (userId) => {
  return await AtsResult.find({ user: userId }).sort({ createdAt: -1 })
}
