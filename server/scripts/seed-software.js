import 'dotenv/config'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { getEnv } from '../utils/env.js'
import { connectToDatabase } from '../utils/db.js'
import { Category } from '../models/Category.js'
import { Software } from '../models/Software.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(raw)
}

function normalizeTitle(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function buildCategoryResolver(existingCategories, mappingOverrides) {
  const byExact = new Map()
  const byNormalized = new Map()
  for (const c of existingCategories) {
    byExact.set(c.title, c)
    byNormalized.set(normalizeTitle(c.title), c)
  }

  const overrides = new Map()
  if (mappingOverrides && typeof mappingOverrides === 'object') {
    for (const [jsonTitle, dbTitle] of Object.entries(mappingOverrides)) {
      overrides.set(normalizeTitle(jsonTitle), String(dbTitle))
    }
  }

  return function resolve(jsonCategoryTitle) {
    const input = String(jsonCategoryTitle || '').trim()
    if (!input) return null
    const inputNorm = normalizeTitle(input)

    // 1) explicit override
    const overrideDbTitle = overrides.get(inputNorm)
    if (overrideDbTitle) {
      const exact = byExact.get(overrideDbTitle) || byNormalized.get(normalizeTitle(overrideDbTitle))
      if (exact) return exact
    }

    // 2) exact match
    if (byExact.has(input)) return byExact.get(input)

    // 3) case-insensitive/normalized match
    const normHit = byNormalized.get(inputNorm)
    if (normHit) return normHit

    // 4) suffix match: allow mapping when JSON titles contain paths like "A → B"
    for (const c of existingCategories) {
      const ct = normalizeTitle(c.title)
      if (inputNorm.endsWith(ct) || ct.endsWith(inputNorm)) return c
    }

    return null
  }
}

function coerceTags(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  return String(value).split(',').map((s) => s.trim()).filter(Boolean)
}

async function seed() {
  const { MONGODB_URI } = getEnv()
  const conn = await connectToDatabase(MONGODB_URI)
  if (!conn) {
    console.error('No DB connection. Aborting seeding.')
    process.exitCode = 1
    return
  }

  const dataPath = path.resolve(__dirname, '..', 'software-data.json')
  const mapPath = path.resolve(__dirname, '..', 'category-map.json')
  const json = await loadJson(dataPath)
  let mappingOverrides = {}
  try {
    const rawMap = await loadJson(mapPath)
    if (rawMap && typeof rawMap === 'object') mappingOverrides = rawMap
  } catch {}

  const existingCategories = await Category.find({})
  const resolveCategory = buildCategoryResolver(existingCategories, mappingOverrides)
  const categories = Array.isArray(json?.categories) ? json.categories : []
  let createdCount = 0
  let updatedCount = 0
  let skippedNoCategory = 0

  for (const group of categories) {
    const categoryTitle = group?.categoryTitle
    const apps = Array.isArray(group?.apps) ? group.apps : []
    if (!apps.length) continue

    const categoryDoc = resolveCategory(categoryTitle)
    if (!categoryDoc) {
      console.warn(`Skipping group with unmatched category: "${categoryTitle}"`)
      continue
    }

    for (const app of apps) {
      const payload = {
        title: app.title,
        description: app.description,
        categoryId: categoryDoc._id,
        categoryTitle: categoryDoc.title,
        type: app.type,
        version: app.version,
        vendor: app.vendor,
        website: app.website,
        license: app.license,
        downloadLink: app.downloadLink,
        altDownloadLink: app.altDownloadLink,
        thumbnailUrl: app.thumbnailUrl,
        images: Array.isArray(app.images) ? app.images : [],
        tags: coerceTags(app.tags),
        rating: typeof app.rating === 'number' ? app.rating : 0,
        downloads: typeof app.downloads === 'number' ? app.downloads : 0,
        releaseDate: app.releaseDate ? new Date(app.releaseDate) : undefined,
        sizeMB: app.sizeMB,
        osSupport: app.osSupport,
        notes: app.notes,
        isActive: app.isActive !== false,
      }

      // Upsert by unique composite key: title + type
      const existing = await Software.findOne({ title: payload.title, type: payload.type })
      if (existing) {
        await Software.updateOne({ _id: existing._id }, { $set: payload })
        updatedCount += 1
      } else {
        await Software.create(payload)
        createdCount += 1
      }
    }
  }

  console.log(`Seeding complete. Created: ${createdCount}, Updated: ${updatedCount}, Skipped (no category): ${skippedNoCategory}`)
  await mongoose.disconnect()
}

seed().catch(async (err) => {
  console.error('Seeding failed:', err)
  try { await mongoose.disconnect() } catch {}
  process.exitCode = 1
})


