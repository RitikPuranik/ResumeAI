import { Router } from 'express'
import { getProfile, updateProfile } from './user.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()
router.get('/profile',    protect, getProfile)
router.put('/profile',    protect, updateProfile)
export default router
