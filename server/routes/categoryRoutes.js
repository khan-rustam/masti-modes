import { Router } from 'express'
import { attachSession, requireAdmin } from '../middleware/auth.js'
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'

const router = Router()

router.get('/', attachSession, requireAdmin, listCategories)
router.post('/', attachSession, requireAdmin, createCategory)
router.put('/:id', attachSession, requireAdmin, updateCategory)
router.delete('/:id', attachSession, requireAdmin, deleteCategory)

export default router


