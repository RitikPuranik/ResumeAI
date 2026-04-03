import pdfParse from 'pdf-parse'
import Resume from './resume.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { generatePdf } from './resume.pdf.js'

// Upload a PDF resume file - extracts basic info and stores file reference
export const uploadResumeService = async (userId, file) => {
  if (!file) throw new ApiError(400, 'No file uploaded')
  
  // Parse PDF to extract text for display/analysis later
  let extractedText = ''
  try {
    const parsed = await pdfParse(file.buffer)
    extractedText = parsed.text || ''
  } catch (e) {
    // PDF parse failure is non-fatal — resume still gets saved
    extractedText = ''
  }

  // Create a minimal resume record from the uploaded PDF
  // Personal info will be empty — user fills it in the builder or it's used for ATS analysis
  const resume = await Resume.create({
    user: userId,
    title: file.originalname || 'Uploaded Resume',
    uploadedPdf: {
      originalName: file.originalname,
      size: file.size,
      extractedText,
    },
    personalInfo: {
      fullName: 'Uploaded Resume',
      email: '',
    },
  })

  return resume
}

export const createResumeService = async (userId, data) => {
  return await Resume.create({ user: userId, ...data })
}

export const getAllResumesService = async (userId) => {
  return await Resume.find({ user: userId }).select('title atsScore isDefault createdAt updatedAt personalInfo.fullName uploadedPdf.originalName')
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