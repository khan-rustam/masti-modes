import { Router } from 'express'
import { attachSession, requireAdmin } from '../middleware/auth.js'
import { listSoftware, createSoftware, updateSoftware, deleteSoftware } from '../controllers/softwareController.js'

const router = Router()

router.get('/', attachSession, requireAdmin, listSoftware)
router.post('/', attachSession, requireAdmin, createSoftware)
router.put('/:id', attachSession, requireAdmin, updateSoftware)
router.delete('/:id', attachSession, requireAdmin, deleteSoftware)

export default router


