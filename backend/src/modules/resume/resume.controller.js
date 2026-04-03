import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import {
  createResumeService, getAllResumesService, getResumeService,
  updateResumeService, deleteResumeService, generateResumePdfService,
  setDefaultResumeService, uploadResumeService,
} from './resume.service.js'

export const uploadResume = asyncHandler(async (req, res) => {
  const resume = await uploadResumeService(req.user._id, req.file)
  res.status(201).json(new ApiResponse(201, { resume }, 'Resume uploaded successfully'))
})

export const createResume = asyncHandler(async (req, res) => {
  const resume = await createResumeService(req.user._id, req.body)
  res.status(201).json(new ApiResponse(201, resume, 'Resume created'))
})

export const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await getAllResumesService(req.user._id)
  res.status(200).json(new ApiResponse(200, resumes, 'Resumes fetched'))
})

export const getResume = asyncHandler(async (req, res) => {
  const resume = await getResumeService(req.params.id, req.user._id)
  res.status(200).json(new ApiResponse(200, resume, 'Resume fetched'))
})

export const updateResume = asyncHandler(async (req, res) => {
  const resume = await updateResumeService(req.params.id, req.user._id, req.body)
  res.status(200).json(new ApiResponse(200, resume, 'Resume updated'))
})

export const deleteResume = asyncHandler(async (req, res) => {
  await deleteResumeService(req.params.id, req.user._id)
  res.status(200).json(new ApiResponse(200, null, 'Resume deleted'))
})

export const downloadResume = asyncHandler(async (req, res) => {
  const pdf = await generateResumePdfService(req.params.id, req.user._id)
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`)
  res.send(pdf)
})

export const setDefaultResume = asyncHandler(async (req, res) => {
  const resume = await setDefaultResumeService(req.params.id, req.user._id)
  res.status(200).json(new ApiResponse(200, resume, 'Default resume set'))
})