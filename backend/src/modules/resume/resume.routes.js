import { Router } from 'express'
import {
  createResume, getAllResumes, getResume,
  updateResume, deleteResume, downloadResume,
  setDefaultResume,
} from './resume.controller.js'
import { protect } from '../../shared/middlewares/protect.middleware.js'
import { usageGuard } from '../../shared/middlewares/usageGuard.middleware.js'
import { USAGE_KEYS } from '../../shared/constants/plans.js'

const router = Router()
router.use(protect)

router.post('/',             usageGuard(USAGE_KEYS.CREATE_RESUME),   createResume)
router.get('/',              getAllResumes)
router.get('/:id',           getResume)
router.put('/:id',           updateResume)
router.delete('/:id',        deleteResume)
router.get('/:id/download',  usageGuard(USAGE_KEYS.PDF_DOWNLOAD),   downloadResume)
router.patch('/:id/default', setDefaultResume)

export default router
