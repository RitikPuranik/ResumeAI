import { Router } from 'express'
import {
  createResume, getAllResumes, getResume,
  updateResume, deleteResume, downloadResume,
  setDefaultResume, uploadResume,
} from './resume.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'
import { usageGuard } from '../../shared/middlewares/usageGuard.middleware.js'
import { upload } from '../../shared/middlewares/upload.middleware.js'
import { USAGE_KEYS } from '../../shared/constants/plans.js'

const router = Router()
router.use(protect)

// File upload route (PDF) - used by ResumeUpload page
router.post('/upload',       upload.single('resume'), usageGuard(USAGE_KEYS.CREATE_RESUME), uploadResume)
// JSON create route (form-based resume builder)
router.post('/',             usageGuard(USAGE_KEYS.CREATE_RESUME),   createResume)
router.get('/',              getAllResumes)
router.get('/:id',           getResume)
router.put('/:id',           updateResume)
router.delete('/:id',        deleteResume)
router.get('/:id/download',  usageGuard(USAGE_KEYS.PDF_DOWNLOAD),   downloadResume)
router.patch('/:id/default', setDefaultResume)

export default router