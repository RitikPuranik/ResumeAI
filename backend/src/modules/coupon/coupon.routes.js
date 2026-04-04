import { Router } from 'express'
import { validateCoupon } from './coupon.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()

/**
 * POST /api/coupons/validate
 * Validate a coupon code and return discount info
 * Body: { code: "SAVE10" }
 */
router.post('/validate', protect, validateCoupon)

export default router
