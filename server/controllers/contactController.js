import { Contact } from '../models/Contact.js'

function buildQuery(filters = {}) {
  const q = {}
  if (filters.search) {
    const re = new RegExp(filters.search, 'i')
    q.$or = [ { fullName: re }, { name: re }, { email: re }, { description: re } ]
  }
  if (filters.status) q.status = filters.status
  if (filters.subject) q.subject = filters.subject
  return q
}

export async function listContacts(req, res) {
  const {
    search = '', status = '', subject = '',
    page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc',
  } = req.query || {}
  const pageNum = Math.max(Number(page) || 1, 1)
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100)
  const query = buildQuery({ search, status, subject })
  const sort = { [String(sortBy)]: String(sortOrder) === 'asc' ? 1 : -1 }
  const [contacts, totalContacts] = await Promise.all([
    Contact.find(query).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum),
    Contact.countDocuments(query),
  ])
  const totalPages = Math.ceil(totalContacts / limitNum) || 1
  return res.json({ ok: true, contacts, pagination: {
    currentPage: pageNum,
    limit: limitNum,
    totalContacts,
    totalPages,
    hasPrevPage: pageNum > 1,
    hasNextPage: pageNum < totalPages,
  } })
}

export async function contactsStats(_req, res) {
  const [total, byStatus] = await Promise.all([
    Contact.countDocuments({}),
    Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ])
  const map = Object.fromEntries(byStatus.map(s => [s._id, s.count]))
  return res.json({ ok: true, overview: {
    total,
    new: map['new'] || 0,
    inProgress: map['in-progress'] || 0,
    closed: map['closed'] || 0,
  } })
}

export async function updateContact(req, res) {
  const { id } = req.params
  const { status, isRead } = req.body || {}
  const update = {}
  if (status) update.status = status
  if (typeof isRead === 'boolean') update.isRead = isRead
  const contact = await Contact.findByIdAndUpdate(id, update, { new: true })
  if (!contact) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true, contact })
}

export async function deleteContact(req, res) {
  const { id } = req.params
  const deleted = await Contact.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true })
}

export async function bulkUpdateContacts(req, res) {
  const { ids = [], status } = req.body || {}
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ ok: false, error: 'No ids' })
  const update = {}
  if (status) update.status = status
  await Contact.updateMany({ _id: { $in: ids } }, { $set: update })
  return res.json({ ok: true })
}

export async function bulkDeleteContacts(req, res) {
  const { ids = [] } = req.body || {}
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ ok: false, error: 'No ids' })
  await Contact.deleteMany({ _id: { $in: ids } })
  return res.json({ ok: true })
}


