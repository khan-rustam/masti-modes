import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'

export async function listUsers(_req, res) {
  const users = await User.find({}).sort({ createdAt: -1 })
  return res.json({ ok: true, users })
}

export async function createUser(req, res) {
  const { name, email, password, role, isActive } = req.body || {}
  if (!name || !email || !password) return res.status(400).json({ ok: false, error: 'Missing fields' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ ok: false, error: 'Email already in use' })
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email, passwordHash, isAdmin: role === 'admin', isActive: isActive !== false })
  return res.json({ ok: true, user })
}

export async function updateUser(req, res) {
  const { id } = req.params
  const { name, email, password, role, isActive } = req.body || {}
  const update = {}
  if (name !== undefined) update.name = name
  if (email !== undefined) update.email = email
  if (typeof isActive === 'boolean') update.isActive = isActive
  if (role) update.isAdmin = role === 'admin'
  if (password) update.passwordHash = await bcrypt.hash(password, 12)
  const user = await User.findByIdAndUpdate(id, update, { new: true })
  if (!user) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true, user })
}

export async function deleteUser(req, res) {
  const { id } = req.params
  const deleted = await User.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true })
}


