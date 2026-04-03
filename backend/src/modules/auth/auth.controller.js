import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { registerUser, loginUser, updateProfile, changePassword } from './auth.service.js'
import User from '../user/user.model.js'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const result = await registerUser(name, email, password)
  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'))
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await loginUser(email, password)
  res.status(200).json(new ApiResponse(200, result, 'Login successful'))
})

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'))
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.status(200).json(new ApiResponse(200, { user }, 'User fetched'))
})

export const updateProfileController = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user._id, req.body)
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated'))
})

export const changePasswordController = asyncHandler(async (req, res) => {
  await changePassword(req.user._id, req.body.currentPassword, req.body.newPassword)
  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'))
})