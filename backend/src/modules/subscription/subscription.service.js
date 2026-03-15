import Razorpay from 'razorpay'
import crypto from 'crypto'
import Subscription from './subscription.model.js'
import { PLANS } from '../../shared/constants/plans.js'
import { ApiError } from '../../shared/utils/apiError.js'

// Lazy init — created on first use so .env is already loaded by then
let _razorpay = null
const getRazorpay = () => {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return _razorpay
}

export const getMySubscriptionService = async (userId) => {
  let sub = await Subscription.findOne({ user: userId })
  if (!sub) sub = await Subscription.create({ user: userId, plan: 'free', status: 'active' })

  const planDetails = PLANS[sub.plan]
  return {
    plan:              sub.plan,
    status:            sub.status,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    currentPeriodEnd:  sub.currentPeriodEnd,
    usage:             sub.usage,
    limits:            planDetails.limits,
    features:          planDetails.features,
    usageResetAt:      sub.usageResetAt,
  }
}

export const getUsageService = async (userId) => {
  let sub = await Subscription.findOne({ user: userId })
  if (!sub) sub = await Subscription.create({ user: userId, plan: 'free', status: 'active' })

  const limits = PLANS[sub.plan].limits
  const usage  = sub.usage

  const summary = {}
  for (const key of Object.keys(usage.toObject ? usage.toObject() : usage)) {
    const limit = limits[key]
    summary[key] = {
      used:       usage[key],
      limit:      limit,
      unlimited:  limit === -1,
      percentage: limit === -1 ? 0 : Math.round((usage[key] / limit) * 100),
    }
  }

  return { plan: sub.plan, usage: summary, resetAt: sub.usageResetAt }
}

/**
 * Step 1 — Create a Razorpay Order (one-time payment, ₹999)
 * Only needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET
 * No plan ID, no webhook required
 */
export const createOrderService = async (userId) => {
  let sub = await Subscription.findOne({ user: userId })
  if (!sub) sub = await Subscription.create({ user: userId, plan: 'free', status: 'inactive' })

  if (sub.plan === 'pro' && sub.status === 'active') {
    throw new ApiError(400, 'You already have an active Pro subscription')
  }

  // Create a one-time Razorpay order — ₹999 = 99900 paise
  const order = await getRazorpay().orders.create({
    amount:   99900,
    currency: 'INR',
    receipt:  `receipt_${userId}_${Date.now()}`,
    notes:    { userId: userId.toString() },
  })

  return {
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId:    process.env.RAZORPAY_KEY_ID,
  }
}

/**
 * Step 2 — Verify payment signature on the backend
 * Called after Razorpay checkout succeeds on the frontend
 * Razorpay signs: orderId + "|" + paymentId with your key secret
 * If signature matches → upgrade user to Pro instantly
 * No webhook needed — verification is synchronous
 */
export const verifyPaymentService = async (userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  // Verify signature
  const body     = `${razorpayOrderId}|${razorpayPaymentId}`
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expected !== razorpaySignature) {
    throw new ApiError(400, 'Payment verification failed — invalid signature')
  }

  // Signature valid — upgrade user to Pro for 30 days
  const now      = new Date()
  const periodEnd = new Date(now)
  periodEnd.setDate(periodEnd.getDate() + 30)

  let sub = await Subscription.findOne({ user: userId })
  if (!sub) sub = await Subscription.create({ user: userId })

  sub.plan               = 'pro'
  sub.status             = 'active'
  sub.currentPeriodStart = now
  sub.currentPeriodEnd   = periodEnd
  sub.cancelAtPeriodEnd  = false
  await sub.save()

  return {
    plan:            sub.plan,
    status:          sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
  }
}

/**
 * Downgrade to free — called manually or when period expires
 */
export const cancelSubscriptionService = async (userId) => {
  const sub = await Subscription.findOne({ user: userId })
  if (!sub || sub.plan !== 'pro') throw new ApiError(400, 'No active Pro subscription found')

  sub.cancelAtPeriodEnd = true
  await sub.save()

  return {
    message:          'Subscription will cancel at period end',
    currentPeriodEnd: sub.currentPeriodEnd,
  }
}