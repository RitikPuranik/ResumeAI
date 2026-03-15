import CoverLetter from './coverletter.model.js'
import Resume from '../resume/resume.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { coverLetterPrompt } from './coverletter.prompts.js'
import { geminiGenerate } from '../../config/gemini.js'

export const generateCoverLetterService = async (userId, { resumeId, jobTitle, company, jobDescription, tone }) => {
  if (!resumeId || !jobTitle) throw new ApiError(400, 'resumeId and jobTitle are required')

  const resume = await Resume.findOne({ _id: resumeId, user: userId })
  if (!resume) throw new ApiError(404, 'Resume not found')

  // Cover letter returns plain text, not JSON
  const content = await geminiGenerate(
    coverLetterPrompt(
      JSON.stringify(resume),
      jobTitle,
      company || '',
      jobDescription || '',
      tone || 'professional'
    )
  )

  const wordCount = content.trim().split(/\s+/).length

  return await CoverLetter.create({
    user: userId,
    resume: resumeId,
    jobTitle,
    company: company || '',
    jobDescription: jobDescription || '',
    tone: tone || 'professional',
    content: content.trim(),
    wordCount,
  })
}

export const getCoverLettersService = async (userId) => {
  return await CoverLetter.find({ user: userId })
    .select('jobTitle company tone wordCount createdAt')
    .sort({ createdAt: -1 })
}

export const getCoverLetterService = async (id, userId) => {
  const letter = await CoverLetter.findOne({ _id: id, user: userId })
  if (!letter) throw new ApiError(404, 'Cover letter not found')
  return letter
}

export const deleteCoverLetterService = async (id, userId) => {
  const letter = await CoverLetter.findOneAndDelete({ _id: id, user: userId })
  if (!letter) throw new ApiError(404, 'Cover letter not found')
}
