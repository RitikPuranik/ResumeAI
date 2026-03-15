import User from './user.model.js'
import { ApiError } from '../../shared/utils/apiError.js'

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) throw new ApiError(404, 'User not found')
  return user
}

export const updateUserProfile = async (userId, data) => {
  const allowed = ['name', 'phone', 'location', 'avatar']
  const updates = {}
  allowed.forEach(field => { if (data[field] !== undefined) updates[field] = data[field] })
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password')
  if (!user) throw new ApiError(404, 'User not found')
  return user
}
