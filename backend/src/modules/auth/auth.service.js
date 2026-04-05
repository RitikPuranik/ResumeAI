import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import Subscription from '../subscription/subscription.model.js'

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

export const registerUser = async (name, email, password) => {
  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(400, 'Email already registered')
  const hashed = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, password: hashed })
  return { user: { id: user._id, name: user.name, email: user.email }, token: generateToken(user._id) }
}

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new ApiError(401, 'Invalid email or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new ApiError(401, 'Invalid email or password')
  const sub = await Subscription.findOne({ user: user._id })
  return {
    user: { id: user._id, name: user.name, email: user.email, plan: sub?.plan || 'free' },
    token: generateToken(user._id)
  }
}

export const updateProfile = async (userId, data) => {
  const allowed = ['name', 'phone', 'location', 'avatar']
  const updates = {}
  allowed.forEach(field => { if (data[field] !== undefined) updates[field] = data[field] })
  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password')
  if (!user) throw new ApiError(404, 'User not found')
  return user
}

export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) throw new ApiError(400, 'Both passwords are required')
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, 'User not found')
  const match = await bcrypt.compare(currentPassword, user.password)
  if (!match) throw new ApiError(401, 'Current password is incorrect')
  user.password = await bcrypt.hash(newPassword, 12)
  await user.save()
}