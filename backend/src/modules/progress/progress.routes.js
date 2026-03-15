import { Router } from 'express'
import { getDashboard, getProgressHistory } from './progress.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()
router.use(protect)
router.get('/dashboard',  getDashboard)
router.get('/history',    getProgressHistory)
export default router
