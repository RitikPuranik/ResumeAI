import { body, validationResult } from 'express-validator'
import { ApiError } from '../../shared/utils/apiError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array())
  next()
}

export const validateCoverLetter = [
  body('resumeId').notEmpty().withMessage('resumeId is required'),
  body('jobTitle').notEmpty().withMessage('jobTitle is required'),
  body('tone').optional().isIn(['professional', 'friendly', 'confident']).withMessage('Invalid tone'),
  validate,
]
