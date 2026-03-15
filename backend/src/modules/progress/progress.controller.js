import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { getDashboardService, getProgressHistoryService } from './progress.service.js'

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardService(req.user._id)
  res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard fetched'))
})

export const getProgressHistory = asyncHandler(async (req, res) => {
  const history = await getProgressHistoryService(req.user._id)
  res.status(200).json(new ApiResponse(200, history, 'Progress history fetched'))
})
