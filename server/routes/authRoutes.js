import { Router } from 'express'
import { register, login, logout, me } from '../controllers/authController.js'
import { attachSession, requireAuth, requireAdmin } from '../middleware/auth.js'
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ ok: true }))
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', attachSession, requireAuth, me)

export default router

// Admin user management
router.get('/admin/users', attachSession, requireAdmin, listUsers)
router.post('/admin/users', attachSession, requireAdmin, createUser)
router.put('/admin/users/:id', attachSession, requireAdmin, updateUser)
router.delete('/admin/users/:id', attachSession, requireAdmin, deleteUser)


