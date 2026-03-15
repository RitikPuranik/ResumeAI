import { Router } from 'express'
import { textToSpeech } from './speech.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'

const router = Router()
router.use(protect)

// Text to Speech — kept for fallback if browser TTS fails
// Speech to Text is now handled 100% in the browser (Web Speech API)
router.post('/speak', textToSpeech)

export default router
