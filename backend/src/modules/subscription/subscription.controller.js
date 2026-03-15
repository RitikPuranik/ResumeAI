import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import {
  getMySubscriptionService,
  createOrderService,
  verifyPaymentService,
  cancelSubscriptionService,
  getUsageService,
} from './subscription.service.js'
import { PLANS } from '../../shared/constants/plans.js'

export const getPlans = asyncHandler(async (req, res) => {
  const plans = Object.entries(PLANS).map(([key, plan]) => ({ key, ...plan }))
  res.status(200).json(new ApiResponse(200, plans, 'Plans fetched'))
})

export const getMySubscription = asyncHandler(async (req, res) => {
  const sub = await getMySubscriptionService(req.user._id)
  res.status(200).json(new ApiResponse(200, sub, 'Subscription fetched'))
})

export const getUsage = asyncHandler(async (req, res) => {
  const usage = await getUsageService(req.user._id)
  res.status(200).json(new ApiResponse(200, usage, 'Usage fetched'))
})

export const createOrder = asyncHandler(async (req, res) => {
  const result = await createOrderService(req.user._id)
  res.status(200).json(new ApiResponse(200, result, 'Order created'))
})

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await verifyPaymentService(req.user._id, req.body)
  res.status(200).json(new ApiResponse(200, result, 'Payment verified — Pro activated'))
})

export const cancelSubscription = asyncHandler(async (req, res) => {
  const sub = await cancelSubscriptionService(req.user._id)
  res.status(200).json(new ApiResponse(200, sub, 'Subscription will cancel at period end'))
})
