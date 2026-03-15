import { body, validationResult } from 'express-validator'
import { ApiError } from '../../shared/utils/apiError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array())
  next()
}

export const validateUpdateProfile = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  validate,
]
