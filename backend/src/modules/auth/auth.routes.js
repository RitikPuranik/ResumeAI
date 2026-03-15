import { Router } from 'express'
import { register, login, logout } from './auth.controller.js'
import { validateRegister, validateLogin } from './auth.validation.js'

const router = Router()
router.post('/register', validateRegister, register)
router.post('/login',    validateLogin,    login)
router.post('/logout',   logout)
export default router
