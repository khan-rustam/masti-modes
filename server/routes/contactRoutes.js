import { Router } from 'express'
import { attachSession, requireAdmin } from '../middleware/auth.js'
import {
  listContacts,
  contactsStats,
  updateContact,
  deleteContact,
  bulkUpdateContacts,
  bulkDeleteContacts,
} from '../controllers/contactController.js'

const router = Router()

// Public create endpoint for contact form submissions
router.post('/', async (req, res, next) => {
  try {
    const { fullName, name, email, phone, subject, description } = req.body || {}
    if (!email || !description || !subject) return res.status(400).json({ ok: false, error: 'Missing required fields' })
    const payload = {
      fullName: fullName || name,
      name: name || fullName,
      email,
      phone,
      subject: subject || 'other',
      description,
      status: 'new',
      isRead: false,
    }
    const { Contact } = await import('../models/Contact.js')
    const created = await Contact.create(payload)
    return res.json({ ok: true, contact: created })
  } catch (e) { next(e) }
})

router.get('/', attachSession, requireAdmin, listContacts)
router.get('/stats', attachSession, requireAdmin, contactsStats)
router.put('/:id', attachSession, requireAdmin, updateContact)
router.delete('/:id', attachSession, requireAdmin, deleteContact)
router.post('/bulk-update', attachSession, requireAdmin, bulkUpdateContacts)
router.post('/bulk-delete', attachSession, requireAdmin, bulkDeleteContacts)

export default router


