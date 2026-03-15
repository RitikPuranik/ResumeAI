import { body, validationResult } from 'express-validator'
import { ApiError } from '../../shared/utils/apiError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array())
  next()
}

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
]

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
]
