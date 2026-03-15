import mongoose from 'mongoose'

/**
 * Tracks each user's current plan and usage limits
 * Resets usage counters every billing cycle (monthly)
 */
const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Plan
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },

  // Razorpay references
  razorpaySubscriptionId: { type: String, default: null },
  razorpayCustomerId:     { type: String, default: null },

  // Subscription period
  currentPeriodStart: { type: Date, default: null },
  currentPeriodEnd:   { type: Date, default: null },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'past_due', 'trialing', 'inactive'],
    default: 'inactive',
  },
  cancelAtPeriodEnd: { type: Boolean, default: false },

  // Daily usage counters (reset every day at midnight)
  usage: {
    resumes:       { type: Number, default: 0 },  // resumes created
    atsChecks:     { type: Number, default: 0 },  // ATS analyses run
    interviews:    { type: Number, default: 0 },  // interview sessions
    jobMatches:    { type: Number, default: 0 },  // job match analyses
    coverLetters:  { type: Number, default: 0 },  // cover letters generated
    pdfDownloads:  { type: Number, default: 0 },  // PDF downloads
  },

  usageResetAt: { type: Date, default: Date.now },

}, { timestamps: true })

export default mongoose.model('Subscription', subscriptionSchema)
