import Coupon from './coupon.model.js'
import { ApiError } from '../../shared/utils/apiError.js'

/**
 * Load coupons defined in .env into the database (seed).
 * Format in .env:
 *   COUPON_SAVE10=10
 *   COUPON_HALF50=50
 *   COUPON_WELCOME20=20
 * Key = COUPON_{CODE}, Value = discount percent
 */
export const seedCouponsFromEnv = async () => {
  const entries = Object.entries(process.env).filter(([k]) => k.startsWith('COUPON_'))
  if (!entries.length) {
    console.log('[Coupon] No COUPON_* env vars found — skipping seed')
    return
  }

  for (const [key, value] of entries) {
    const code = key.replace('COUPON_', '').toUpperCase()
    const discount = parseInt(value, 10)
    if (isNaN(discount) || discount < 1 || discount > 100) {
      console.warn(`[Coupon] Invalid discount for ${key}: ${value} — skipping`)
      continue
    }
    await Coupon.findOneAndUpdate(
      { code },
      { code, discountPercent: discount, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    console.log(`[Coupon] ✅ ${code} → ${discount}% off`)
  }
}

/**
 * Validate a coupon code and return discount details.
 * Does NOT increment usedCount here — that happens after successful payment.
 */
export const validateCouponService = async (code, userId) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() })

  if (!coupon || !coupon.isActive) {
    throw new ApiError(404, 'Coupon not found or has been deactivated')
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    throw new ApiError(400, 'This coupon has expired')
  }

  if (coupon.maxUses !== -1 && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError(400, 'This coupon has reached its maximum usage limit')
  }

  if (userId && coupon.usedBy.some(id => id.toString() === userId.toString())) {
    throw new ApiError(400, 'You have already used this coupon')
  }

  return {
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    description: coupon.description,
    isValid: true,
  }
}

/**
 * Mark a coupon as used by a user (called after successful payment).
 */
export const applyCouponService = async (code, userId) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() })
  if (!coupon) return

  await Coupon.findByIdAndUpdate(coupon._id, {
    $inc: { usedCount: 1 },
    $addToSet: { usedBy: userId },
  })
}