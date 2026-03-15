import Subscription from '../../modules/subscription/subscription.model.js'
import { PLANS, USAGE_KEYS } from '../constants/plans.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * Usage guard middleware factory
 * Usage: router.post('/create', protect, usageGuard(USAGE_KEYS.CREATE_RESUME), controller)
 *
 * - Checks if user has exceeded their plan limits
 * - Increments usage counter if allowed
 * - Creates a free subscription record if none exists
 */
export const usageGuard = (featureKey) => asyncHandler(async (req, res, next) => {
  let sub = await Subscription.findOne({ user: req.user._id })

  // Auto-create free subscription if not exists
  if (!sub) {
    sub = await Subscription.create({ user: req.user._id, plan: 'free', status: 'active' })
  }

  // Reset daily usage if a new day has started
  const now = new Date()
  const resetAt = new Date(sub.usageResetAt)
  const dayPassed =
    now.getFullYear() > resetAt.getFullYear() ||
    now.getMonth()    > resetAt.getMonth()    ||
    now.getDate()     > resetAt.getDate()

  if (dayPassed) {
    sub.usage = { resumes: 0, atsChecks: 0, interviews: 0, jobMatches: 0, coverLetters: 0, pdfDownloads: 0 }
    sub.usageResetAt = now
    await sub.save()
  }

  const plan   = PLANS[sub.plan] || PLANS.free
  const limit  = plan.limits[featureKey]
  const current = sub.usage[featureKey] ?? 0

  // -1 means unlimited (pro plan)
  if (limit !== -1 && current >= limit) {
    throw new ApiError(403,
      `You've reached your ${sub.plan} plan limit for this feature. Upgrade to Pro to continue.`,
      [{ feature: featureKey, limit, used: current, plan: sub.plan }]
    )
  }

  // Increment usage
  sub.usage[featureKey] = current + 1
  await sub.save()

  // Attach subscription to request for downstream use
  req.subscription = sub
  next()
})
