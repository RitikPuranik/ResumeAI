import { Router } from 'express'
import { register, login, logout, getMe, updateProfileController, changePasswordController } from './auth.controller.js'
import { validateRegister, validateLogin } from './auth.validation.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()
router.post('/register', validateRegister, register)
router.post('/login',    validateLogin,    login)
router.post('/logout',   logout)
router.get('/me',        protect, getMe)
router.put('/profile',   protect, updateProfileController)
router.put('/password',  protect, changePasswordController)

export default router