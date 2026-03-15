import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { analyzeMatchService, getMatchHistoryService } from './jobmatch.service.js'

export const analyzeMatch = asyncHandler(async (req, res) => {
  const result = await analyzeMatchService(req.user._id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Match analysis complete'))
})

export const getMatchHistory = asyncHandler(async (req, res) => {
  const history = await getMatchHistoryService(req.user._id)
  res.status(200).json(new ApiResponse(200, history, 'Match history fetched'))
})
