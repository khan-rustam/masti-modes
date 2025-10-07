import { cloudinary, initCloudinary } from '../utils/cloudinary.js'

initCloudinary()

function buildFolderPath(type = 'pc', categoryTitle = 'Uncategorized', softwareTitle = 'General') {
  const safe = (s) => String(s || '').trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase()
  const level1 = safe(type) === 'mobile' ? 'Mobile' : 'PC'
  return `${level1}/${safe(categoryTitle) || 'uncategorized'}/${safe(softwareTitle) || 'general'}`
}

export async function uploadImage(req, res) {
  try {
    const { file, body } = req
    const { type, categoryTitle, softwareTitle } = body || {}
    if (!file?.path) return res.status(400).json({ ok: false, error: 'No file uploaded' })
    const folder = buildFolderPath(type, categoryTitle, softwareTitle)
    const result = await cloudinary.uploader.upload(file.path, { folder })
    return res.json({ ok: true, asset: { url: result.secure_url, public_id: result.public_id, bytes: result.bytes, width: result.width, height: result.height, format: result.format, folder: result.folder } })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Upload failed' })
  }
}

export async function listImages(req, res) {
  try {
    const { type, categoryTitle, softwareTitle, nextCursor } = req.query || {}
    const folder = buildFolderPath(type, categoryTitle, softwareTitle)
    const result = await cloudinary.search.expression(`folder:"${folder}"`).with_field('context').sort_by('created_at','desc').max_results(30).next_cursor(nextCursor || undefined).execute()
    return res.json({ ok: true, assets: result.resources?.map(r => ({ url: r.secure_url, public_id: r.public_id, bytes: r.bytes, width: r.width, height: r.height, format: r.format, folder: r.folder })), nextCursor: result.next_cursor })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'List failed' })
  }
}

export async function deleteImage(req, res) {
  try {
    const { publicId } = req.params
    if (!publicId) return res.status(400).json({ ok: false, error: 'publicId is required' })
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result !== 'ok' && result.result !== 'not found') return res.status(500).json({ ok: false, error: 'Delete failed' })
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Delete failed' })
  }
}


