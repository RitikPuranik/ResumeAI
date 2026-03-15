import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { registerUser, loginUser } from './auth.service.js'

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
