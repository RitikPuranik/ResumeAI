import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { evaluateInterviewService, getEvaluationService } from './evaluation.service.js'

export const evaluateInterview = asyncHandler(async (req, res) => {
  const result = await evaluateInterviewService(req.params.interviewId, req.user._id)
  res.status(200).json(new ApiResponse(200, result, 'Evaluation complete'))
})

export const getEvaluation = asyncHandler(async (req, res) => {
  const result = await getEvaluationService(req.params.interviewId, req.user._id)
  res.status(200).json(new ApiResponse(200, result, 'Evaluation fetched'))
})
