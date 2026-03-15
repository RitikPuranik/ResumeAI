import { Router } from 'express'
import { generateCoverLetter, getCoverLetters, getCoverLetter, deleteCoverLetter } from './coverletter.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'
import { usageGuard } from '../../shared/middlewares/usageGuard.middleware.js'
import { USAGE_KEYS } from '../../shared/constants/plans.js'

const router = Router()
router.use(protect)
router.post('/generate', usageGuard(USAGE_KEYS.COVER_LETTER), generateCoverLetter)
router.get('/',          getCoverLetters)
router.get('/:id',       getCoverLetter)
router.delete('/:id',    deleteCoverLetter)
export default router
