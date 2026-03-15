import Resume from './resume.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { generatePdf } from './resume.pdf.js'

export const createResumeService = async (userId, data) => {
  return await Resume.create({ user: userId, ...data })
}

export const getAllResumesService = async (userId) => {
  return await Resume.find({ user: userId }).select('title atsScore isDefault createdAt updatedAt')
}

export const getResumeService = async (resumeId, userId) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId })
  if (!resume) throw new ApiError(404, 'Resume not found')
  return resume
}

export const updateResumeService = async (resumeId, userId, data) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, user: userId },
    data,
    { new: true }
  )
  if (!resume) throw new ApiError(404, 'Resume not found')
  return resume
}

export const deleteResumeService = async (resumeId, userId) => {
  const resume = await Resume.findOneAndDelete({ _id: resumeId, user: userId })
  if (!resume) throw new ApiError(404, 'Resume not found')
}

export const generateResumePdfService = async (resumeId, userId) => {
  const resume = await getResumeService(resumeId, userId)
  return await generatePdf(resume)
}

export const setDefaultResumeService = async (resumeId, userId) => {
  await Resume.updateMany({ user: userId }, { isDefault: false })
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, user: userId },
    { isDefault: true },
    { new: true }
  )
  if (!resume) throw new ApiError(404, 'Resume not found')
  return resume
}
