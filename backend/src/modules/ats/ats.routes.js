import { Router } from 'express'
import { analyzeResume, getAtsHistory } from './ats.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'
import { upload } from '../../shared/middlewares/upload.middleware.js'
import { usageGuard } from '../../shared/middlewares/usageGuard.middleware.js'
import { USAGE_KEYS } from '../../shared/constants/plans.js'

const router = Router()
router.use(protect)
router.post('/analyze', upload.single('resume'), usageGuard(USAGE_KEYS.ATS_CHECK), analyzeResume)
router.get('/history',  getAtsHistory)
export default router
