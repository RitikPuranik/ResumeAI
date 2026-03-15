import { Router } from 'express'
import { analyzeMatch, getMatchHistory } from './jobmatch.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'
import { usageGuard } from '../../shared/middlewares/usageGuard.middleware.js'
import { USAGE_KEYS } from '../../shared/constants/plans.js'

const router = Router()
router.use(protect)
router.post('/analyze', usageGuard(USAGE_KEYS.JOB_MATCH),    analyzeMatch)
router.get('/history',  getMatchHistory)
export default router
