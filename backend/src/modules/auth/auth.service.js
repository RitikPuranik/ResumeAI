import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'
import { ApiError } from '../../shared/utils/apiError.js'

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
  return { user: { id: user._id, name: user.name, email: user.email }, token: generateToken(user._id) }
}
