import { body, validationResult } from 'express-validator'
import { ApiError } from '../../shared/utils/apiError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array())
  next()
}

export const validateResume = [
  body('personalInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  // company is intentionally NOT validated as required anywhere
  validate,
]
