import { Software } from '../models/Software.js'
import { Category } from '../models/Category.js'
import { cloudinary, initCloudinary } from '../utils/cloudinary.js'

initCloudinary()

export async function listSoftware(req, res) {
  const {
    search = '', type = '', categoryId = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc',
  } = req.query || {}
  const q = {}
  if (search) q.$or = [{ title: new RegExp(String(search), 'i') }, { description: new RegExp(String(search), 'i') }]
  if (type) q.type = type
  if (categoryId) q.categoryId = categoryId
  const pageNum = Math.max(Number(page) || 1, 1)
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100)
  const sort = { [String(sortBy)]: String(sortOrder) === 'asc' ? 1 : -1 }
  const [items, total] = await Promise.all([
    Software.find(q).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum),
    Software.countDocuments(q),
  ])
  const totalPages = Math.ceil(total / limitNum) || 1
  return res.json({ ok: true, software: items, pagination: { currentPage: pageNum, limit: limitNum, total, totalPages, hasPrevPage: pageNum > 1, hasNextPage: pageNum < totalPages } })
}

export async function createSoftware(req, res) {
  const body = req.body || {}
  if (!body.title || !body.categoryId || !body.type) return res.status(400).json({ ok: false, error: 'title, categoryId and type are required' })
  const category = await Category.findById(body.categoryId)
  if (!category) return res.status(404).json({ ok: false, error: 'Category not found' })
  const tags = Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(',').map(s => s.trim()).filter(Boolean)
  const images = Array.isArray(body.images) ? body.images : []
  const item = await Software.create({
    ...body,
    categoryTitle: category.title,
    tags,
    images,
  })
  return res.json({ ok: true, software: item })
}

export async function updateSoftware(req, res) {
  const { id } = req.params
  const body = req.body || {}
  if (body.categoryId) {
    const category = await Category.findById(body.categoryId)
    if (!category) return res.status(404).json({ ok: false, error: 'Category not found' })
    body.categoryTitle = category.title
  }
  const item = await Software.findByIdAndUpdate(id, body, { new: true })
  if (!item) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true, software: item })
}

export async function deleteSoftware(req, res) {
  const { id } = req.params
  const doc = await Software.findById(id)
  if (!doc) return res.status(404).json({ ok: false, error: 'Not found' })
  // Try to delete images from Cloudinary, but don't fail the request if some fail
  const images = Array.isArray(doc.images) ? doc.images : []
  await Promise.allSettled(images.map((img) => {
    if (!img?.public_id) return Promise.resolve()
    return cloudinary.uploader.destroy(img.public_id)
  }))
  const deleted = await Software.findByIdAndDelete(id)
  if (!deleted) return res.status(404).json({ ok: false, error: 'Not found' })
  return res.json({ ok: true })
}

// Public software endpoints
export async function getPublicSoftware(req, res) {
  const {
    search = '', type = '', categoryId = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc',
  } = req.query || {}
  const q = { isActive: true }
  if (search) q.$or = [{ title: new RegExp(String(search), 'i') }, { description: new RegExp(String(search), 'i') }]
  if (type) q.type = type
  if (categoryId) q.categoryId = categoryId
  const pageNum = Math.max(Number(page) || 1, 1)
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100)
  const sort = { [String(sortBy)]: String(sortOrder) === 'asc' ? 1 : -1 }
  const [items, total] = await Promise.all([
    Software.find(q).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum),
    Software.countDocuments(q),
  ])
  const totalPages = Math.ceil(total / limitNum) || 1
  return res.json({ ok: true, software: items, pagination: { currentPage: pageNum, limit: limitNum, total, totalPages, hasPrevPage: pageNum > 1, hasNextPage: pageNum < totalPages } })
}

export async function getSoftwareById(req, res) {
  const { id } = req.params
  const item = await Software.findOne({ _id: id, isActive: true })
  if (!item) return res.status(404).json({ ok: false, error: 'Software not found' })
  return res.json({ ok: true, software: item })
}

export async function getLatestSoftware(req, res) {
  const { limit = 6 } = req.query
  const limitNum = Math.min(Math.max(Number(limit) || 6, 1), 50)
  const items = await Software.find({ isActive: true }).sort({ createdAt: -1 }).limit(limitNum)
  return res.json({ ok: true, software: items })
}

export async function getMostDownloadedSoftware(req, res) {
  const { limit = 6 } = req.query
  const limitNum = Math.min(Math.max(Number(limit) || 6, 1), 50)
  const items = await Software.find({ isActive: true }).sort({ downloads: -1 }).limit(limitNum)
  return res.json({ ok: true, software: items })
}

export async function getRecentlyUpdatedSoftware(req, res) {
  const { limit = 6 } = req.query
  const limitNum = Math.min(Math.max(Number(limit) || 6, 1), 50)
  const items = await Software.find({ isActive: true }).sort({ updatedAt: -1 }).limit(limitNum)
  return res.json({ ok: true, software: items })
}


