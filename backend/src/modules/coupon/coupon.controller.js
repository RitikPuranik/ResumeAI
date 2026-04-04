import { validateCouponService } from './coupon.service.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'

/**
 * POST /api/coupons/validate
 * Body: { code: "SAVE10" }
 * Returns discount info if valid.
 */
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: 'Coupon code is required' })
  }

  const result = await validateCouponService(code, req.user?._id)
  return res.status(200).json(new ApiResponse(200, result, `Coupon valid — ${result.discountPercent}% discount applied`))
})