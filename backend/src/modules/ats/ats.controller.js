import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { analyzeResumeService, getAtsHistoryService } from './ats.service.js'

export const analyzeResume = asyncHandler(async (req, res) => {
  const result = await analyzeResumeService(req.user._id, req.body.resumeId, req.file)
  res.status(200).json(new ApiResponse(200, result, 'ATS analysis complete'))
})

export const getAtsHistory = asyncHandler(async (req, res) => {
  const history = await getAtsHistoryService(req.user._id)
  res.status(200).json(new ApiResponse(200, history, 'ATS history fetched'))
})
