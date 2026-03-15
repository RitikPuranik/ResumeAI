import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { getUserProfile, updateUserProfile } from './user.service.js'

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user._id)
  res.status(200).json(new ApiResponse(200, user, 'Profile fetched'))
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body)
  res.status(200).json(new ApiResponse(200, user, 'Profile updated'))
})
