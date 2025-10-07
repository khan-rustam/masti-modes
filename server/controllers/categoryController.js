import { Category } from '../models/Category.js'

export async function listCategories(_req, res) {
  const items = await Category.find({}).sort({ createdAt: -1 })
  return res.json({ ok: true, categories: items })
}

export async function createCategory(req, res) {
  const { title, description, isActive } = req.body || {}
  if (!title) return res.status(400).json({ ok: false, error: 'Title is required' })
  try {
    const item = await Category.create({ title, description, isActive: isActive !== false })
    return res.json({ ok: true, category: item })
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ ok: false, error: 'Category title already exists' })
    throw e
  }
}

export async function updateCategory(req, res) {
  const { id } = req.params
  const { title, description, isActive } = req.body || {}
  const update = {}
  if (title !== undefined) update.title = title
  if (description !== undefined) update.description = description
  if (typeof isActive === 'boolean') update.isActive = isActive
  const item = await Category.findByIdAndUpdate(id, update, { new: true })
  if (!item) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true, category: item })
}

export async function deleteCategory(req, res) {
  const { id } = req.params
  const deleted = await Category.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true })
}


