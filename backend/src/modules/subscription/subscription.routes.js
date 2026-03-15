import { Router } from 'express'
import {
  getMySubscription,
  createOrder,
  verifyPayment,
  cancelSubscription,
  getPlans,
  getUsage,
} from './subscription.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()

router.get('/plans',          getPlans)          // public
router.use(protect)
router.get('/me',             getMySubscription) // current plan + usage
router.get('/usage',          getUsage)          // usage counters
router.post('/create-order',  createOrder)       // step 1 — create Razorpay order
router.post('/verify',        verifyPayment)     // step 2 — verify + activate Pro
router.post('/cancel',        cancelSubscription)

export default router
