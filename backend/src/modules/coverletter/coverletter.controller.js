import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import {
  generateCoverLetterService, getCoverLettersService,
  getCoverLetterService, deleteCoverLetterService,
} from './coverletter.service.js'

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const result = await generateCoverLetterService(req.user._id, req.body)
  res.status(201).json(new ApiResponse(201, result, 'Cover letter generated'))
})

export const getCoverLetters = asyncHandler(async (req, res) => {
  const letters = await getCoverLettersService(req.user._id)
  res.status(200).json(new ApiResponse(200, letters, 'Cover letters fetched'))
})

export const getCoverLetter = asyncHandler(async (req, res) => {
  const letter = await getCoverLetterService(req.params.id, req.user._id)
  res.status(200).json(new ApiResponse(200, letter, 'Cover letter fetched'))
})

export const deleteCoverLetter = asyncHandler(async (req, res) => {
  await deleteCoverLetterService(req.params.id, req.user._id)
  res.status(200).json(new ApiResponse(200, null, 'Cover letter deleted'))
})
