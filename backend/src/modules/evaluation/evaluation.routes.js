import { Router } from 'express'
import { evaluateInterview, getEvaluation } from './evaluation.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()
router.use(protect)
router.post('/evaluate/:interviewId',  evaluateInterview)
router.get('/:interviewId',            getEvaluation)
export default router
