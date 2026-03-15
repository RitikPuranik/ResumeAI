import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../../modules/user/user.model.js'

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null
  if (!token) throw new ApiError(401, 'Not authorized, no token')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id).select('-password')
  if (!req.user) throw new ApiError(401, 'User not found')
  next()
})
