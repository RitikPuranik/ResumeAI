import { body, validationResult } from 'express-validator'
import { ApiError } from '../../shared/utils/apiError.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new ApiError(422, 'Validation failed', errors.array())
  next()
}

export const validateSetup = [
  body('role').notEmpty().withMessage('Role is required'),
  body('roundType').isIn(['technical', 'hr', 'mixed']).withMessage('Invalid round type'),
  validate,
]
