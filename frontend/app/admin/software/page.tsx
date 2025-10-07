"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { categoryApi, softwareApi } from '@/lib/api'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type Category = { _id: string; title: string }

export default function AdminSoftwarePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [pagination, setPagination] = useState<any>({ currentPage: 1, limit: 10, total: 0, totalPages: 1 })
  const [filters, setFilters] = useState<{ search: string; type: '' | 'pc' | 'mobile'; categoryId: string }>({ search: '', type: '', categoryId: '' })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    type: 'pc' as 'pc' | 'mobile',
    version: '',
    vendor: '',
    website: '',
    downloadLink: '',
    altDownloadLink: '',
    thumbnailUrl: '',
    tags: '' as string, // comma-separated
    isActive: true,
    rating: 0 as number,
    downloads: 0 as number,
    downloadsText: '0' as string,
    releaseDate: '' as string,
    sizeMB: '' as string,
    license: 'free',
    osSupport: '' as string, // e.g. Windows 10/11; Android 13
    notes: '',
  })
  function parseCompactNumber(input: string): number {
    if (!input) return 0
    const trimmed = String(input).trim().replace(/,/g, '')
    const match = /^([0-9]*\.?[0-9]+)\s*([kKmMbB]?)$/.exec(trimmed)
    if (!match) return Number(trimmed) || 0
    const value = parseFloat(match[1])
    const unit = match[2].toLowerCase()
    if (unit === 'k') return Math.round(value * 1_000)
    if (unit === 'm') return Math.round(value * 1_000_000)
    if (unit === 'b') return Math.round(value * 1_000_000_000)
    return Math.round(value)
  }

  function formatCompactNumber(value: number): string {
    if (!value || value < 1000) return String(Math.max(0, Math.round(value || 0)))
    if (value < 1_000_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`
    if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
    return `${(value / 1_000_000_000).toFixed(value % 1_000_000_000 === 0 ? 0 : 1)}B`
  }

  const [images, setImages] = useState<{ url: string; public_id?: string; width?: number; height?: number; bytes?: number; format?: string; folder?: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => { (async () => { try { const res = await categoryApi.list(); setCategories(res.categories || []) } catch { } finally { setLoading(false) } })() }, [])

  useEffect(() => { loadList(1) }, [filters])

  const categoryOptions = useMemo(() => categories.map(c => ({ id: c._id, label: c.title })), [categories])

  async function loadList(page: number) {
    try {
      setListLoading(true)
      const res = await softwareApi.list({ search: filters.search, type: filters.type, categoryId: filters.categoryId, page, limit: pagination.limit })
      setItems(res.software || [])
      setPagination(res.pagination || { currentPage: page, limit: pagination.limit, total: 0, totalPages: 1 })
    } catch { toast.error('Failed to load software') } finally { setListLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.categoryId) { toast.warning('Please fill Title and Category.'); return }
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        type: form.type,
        version: form.version,
        vendor: form.vendor,
        website: form.website,
        license: form.license,
        downloadLink: form.downloadLink,
        altDownloadLink: form.altDownloadLink,
        thumbnailUrl: form.thumbnailUrl || images[0]?.url || '',
        images,
        tags: form.tags,
        rating: form.rating,
        downloads: parseCompactNumber(form.downloadsText || String(form.downloads || '0')),
        releaseDate: form.releaseDate ? new Date(form.releaseDate) : undefined,
        sizeMB: form.sizeMB,
        osSupport: form.osSupport,
        notes: form.notes,
        isActive: form.isActive,
      }
      const res = (editing ? await softwareApi.update(editing._id, payload) : await softwareApi.create(payload)) as any
      if (res?.ok === false) throw new Error((res as any)?.error || 'Failed to save')
      toast.success(editing ? 'Software updated' : 'Software saved')
      setShowForm(false)
      // reset minimal
      setForm(prev => ({ ...prev, title: '', description: '', version: '', website: '', vendor: '', downloadLink: '', altDownloadLink: '', thumbnailUrl: '', tags: '', rating: 0, downloads: 0, downloadsText: '0', releaseDate: '', sizeMB: '', osSupport: '', notes: '' }))
      setImages([])
      loadList(pagination.currentPage)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save')
    }
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return
    if (!form.title || !form.categoryId) { toast.warning('Please fill Title and Category first.'); return }
    const categoryTitle = categories.find(c => c._id === form.categoryId)?.title || 'Uncategorized'
    for (const file of files) {
      if (!file.type.startsWith('image/')) { toast.warning('Only image files are allowed'); continue }
      if (file.size > 5 * 1024 * 1024) { toast.warning('Max file size is 5MB'); continue }
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', form.type)
      fd.append('categoryTitle', categoryTitle)
      fd.append('softwareTitle', form.title)
      try {
        const res = await fetch(api.baseUrl ? `${api.baseUrl}/api/admin/cloudinary` : `/api/admin/cloudinary`, { method: 'POST', body: fd, credentials: 'include' as RequestCredentials })
        const data = await res.json()
        if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed')
        setImages(prev => [...prev, data.asset])
        if (!form.thumbnailUrl) setForm(prev => ({ ...prev, thumbnailUrl: data.asset.url }))
        toast.success('Image uploaded')
      } catch (err: any) { toast.error(err?.message || 'Upload failed') }
    }
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    await uploadFiles(files)
    if (e.target) e.target.value = ''
  }

  async function handleSaving() {
    toast.loading('Saving…')
    await handleSubmit(new Event('submit') as any)
    toast.dismiss()
  }

  async function handleDelete(id: string) {
    try {
      toast.loading('Deleting…')
      await softwareApi.delete(id)
      toast.success('Software and associated images deleted (where possible)')
      setShowDelete(false)
      setSelected(null)
      loadList(pagination.currentPage)
    } catch { toast.error('Delete failed') } finally { toast.dismiss() }
  }

  async function handleDeleteImage(publicId?: string) {
    if (!publicId) return
    try {
      const res = await fetch(api.baseUrl ? `${api.baseUrl}/api/admin/cloudinary/${encodeURIComponent(publicId)}` : `/api/admin/cloudinary/${encodeURIComponent(publicId)}`, { method: 'DELETE', credentials: 'include' as RequestCredentials })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed')
      setImages(prev => prev.filter(i => i.public_id !== publicId))
      toast.success('Image deleted')
    } catch (err: any) { toast.error(err?.message || 'Delete failed') }
  }

  function startEdit(item: any) {
    setEditing(item)
    setForm({
      title: item.title || '',
      description: item.description || '',
      categoryId: item.categoryId || '',
      type: (item.type as 'pc' | 'mobile') || 'pc',
      version: item.version || '',
      vendor: item.vendor || '',
      website: item.website || '',
      downloadLink: item.downloadLink || '',
      altDownloadLink: item.altDownloadLink || '',
      thumbnailUrl: item.thumbnailUrl || '',
      tags: (Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '')),
      isActive: item.isActive !== false,
      rating: item.rating || 0,
      downloads: item.downloads || 0,
      downloadsText: formatCompactNumber(item.downloads || 0),
      releaseDate: item.releaseDate ? String(item.releaseDate).slice(0, 10) : '',
      sizeMB: item.sizeMB || '',
      license: item.license || 'free',
      osSupport: item.osSupport || '',
      notes: item.notes || '',
    })
    setImages(item.images || [])
    setShowForm(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Software Manager</h1>
          <p className="text-slate-600">Manage software entries and create new ones</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-[6px]" onClick={() => { setEditing(null); setShowForm(true) }}>Create New Software</Button>
      </div>

      {/* Filters and List */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="w-full px-3 py-2 border rounded-md" placeholder="Search title or description…" value={filters.search} onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))} />
            <div>
              <Select value={(filters.type || 'all') as any} onValueChange={(v: 'all' | 'pc' | 'mobile') => setFilters(prev => ({ ...prev, type: v === 'all' ? '' : v }))}>
                <SelectTrigger className="rounded-md w-full"><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="pc">PC</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={(filters.categoryId || 'all') as any} onValueChange={(v) => setFilters(prev => ({ ...prev, categoryId: v === 'all' ? '' : v }))}>
                <SelectTrigger className="rounded-md w-full"><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categoryOptions.map(o => (<SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Downloads</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {listLoading ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center">Loading…</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-600">No software found</td></tr>
                ) : (
                  items.map(item => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <div className="font-medium text-slate-800">{item.title}</div>
                        <div className="text-xs text-slate-500">v{item.version || '-'} • {item.vendor || ''}</div>
                      </td>
                      <td className="px-6 py-3">{item.categoryTitle || '-'}</td>
                      <td className="px-6 py-3">{item.type?.toUpperCase()}</td>
                      <td className="px-6 py-3">{formatCompactNumber(item.downloads || 0)}</td>
                      <td className="px-6 py-3"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{item.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button variant="outline" className="rounded-[6px]" onClick={() => startEdit(item)}>Edit</Button>
                          <Button variant="outline" className="rounded-[6px]" onClick={() => { setSelected(item); setShowDelete(true); toast.message('Ready to delete. Confirm in the dialog.') }}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-3">
              <div className="text-sm text-slate-600">Page {pagination.currentPage} of {pagination.totalPages}</div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-[6px]" disabled={!pagination.hasPrevPage} onClick={() => loadList(pagination.currentPage - 1)}>Previous</Button>
                <Button variant="outline" className="rounded-[6px]" disabled={!pagination.hasNextPage} onClick={() => loadList(pagination.currentPage + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal (UI only) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editing ? 'Edit Software' : 'Create New Software'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-md hover:bg-slate-100">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., VLC Media Player" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Version</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., 3.0.20" value={form.version} onChange={e => setForm(prev => ({ ...prev, version: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea className="w-full px-3 py-2 border rounded-md" placeholder="Short description" rows={4} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
                </div>
              </div>

              {/* Classification */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="mt-1">
                    <Select value={form.categoryId} onValueChange={v => setForm(prev => ({ ...prev, categoryId: v }))}>
                      <SelectTrigger className="rounded-md w-full"><SelectValue placeholder={loading ? 'Loading…' : 'Select category'} /></SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(o => (<SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <div className="mt-1">
                    <Select value={form.type} onValueChange={(v: 'pc' | 'mobile') => setForm(prev => ({ ...prev, type: v }))}>
                      <SelectTrigger className="rounded-md w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pc">PC</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <input id="active" type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                  <label htmlFor="active" className="text-sm">Active</label>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Upload Images</label>
                    <div
                      className={`mt-2 w-full rounded-xl border-2 border-dashed ${isDragging ? 'border-orange-400 bg-orange-50' : 'border-slate-300'} p-8 text-center cursor-pointer`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); const files = Array.from(e.dataTransfer.files || []); uploadFiles(files) }}
                      role="button"
                      aria-label="Upload images"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-slate-400"><path d="M12 2a7 7 0 0 1 7 7v1h1a3 3 0 0 1 0 6h-2.18A3 3 0 0 1 15 19H9a3 3 0 0 1-2.82-3H4a3 3 0 1 1 0-6h1V9a7 7 0 0 1 7-7Zm-1 9v5a1 1 0 1 0 2 0v-5h1.586a1 1 0 0 0 .707-1.707l-2.586-2.586a1 1 0 0 0-1.414 0L8.707 8.293A1 1 0 0 0 9.414 10H11Z" /></svg>
                        <div className="text-sm font-medium">Click to upload images</div>
                        <div className="text-xs text-slate-500">or drag & drop. PNG/JPG, Max 5MB each</div>
                        <div className="text-xs text-slate-500">Images are uploaded to Cloudinary in folder: PC/Mobile &gt; Category &gt; Software Name</div>
                      </div>
                      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFilesSelected} className="hidden" />
                    </div>
                  </div>
                </div>
                {images.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Gallery & Thumbnail</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {images.map(img => (
                        <div key={img.url} className="border rounded-md overflow-hidden">
                          <img src={img.url} alt="uploaded" className="w-full h-28 object-cover" />
                          <div className="p-2 flex items-center justify-between">
                            <button type="button" className={`text-xs px-2 py-1 rounded-md border ${form.thumbnailUrl === img.url ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : 'border-slate-300 text-slate-700'}`} onClick={() => setForm(prev => ({ ...prev, thumbnailUrl: img.url }))}>Set Thumbnail</button>
                            {img.public_id && (
                              <button type="button" className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-700" onClick={() => handleDeleteImage(img.public_id)}>Delete</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vendor & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Vendor</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., VideoLAN" value={form.vendor} onChange={e => setForm(prev => ({ ...prev, vendor: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="https://example.com" value={form.website} onChange={e => setForm(prev => ({ ...prev, website: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">License</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="free, freemium, paid, open-source" value={form.license} onChange={e => setForm(prev => ({ ...prev, license: e.target.value }))} />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Main Download Link</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="https://..." value={form.downloadLink} onChange={e => setForm(prev => ({ ...prev, downloadLink: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Alternate Download Link</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="https://..." value={form.altDownloadLink} onChange={e => setForm(prev => ({ ...prev, altDownloadLink: e.target.value }))} />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Rating (0-5)</label>
                  <input type="number" min={0} max={5} step={0.1} className="w-full px-3 py-2 border rounded-md" value={form.rating} onChange={e => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Downloads</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 199K or 2M"
                    value={form.downloadsText}
                    onChange={e => {
                      const text = e.target.value
                      const numeric = parseCompactNumber(text)
                      setForm(prev => ({ ...prev, downloadsText: text, downloads: numeric }))
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Release Date</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-md" value={form.releaseDate} onChange={e => setForm(prev => ({ ...prev, releaseDate: e.target.value }))} />
                </div>
              </div>

              {/* System */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Size (MB)</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., 120" value={form.sizeMB} onChange={e => setForm(prev => ({ ...prev, sizeMB: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">OS Support</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Windows 10/11; macOS 13; Android 13" value={form.osSupport} onChange={e => setForm(prev => ({ ...prev, osSupport: e.target.value }))} />
                </div>
              </div>

              {/* Tags & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="video, player, media" value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes (internal)</label>
                  <input className="w-full px-3 py-2 border rounded-md" placeholder="Internal notes only" value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-[6px]" onClick={() => handleSaving()}>Save</Button>
                <Button type="button" variant="outline" className="rounded-[6px]" onClick={() => toast.message('Preview coming soon')}>Preview</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {showDelete && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-sm mx-4">
            <h3 className="font-semibold mb-2">Delete Software</h3>
            <p className="text-sm text-slate-600 mb-4">Are you sure you want to delete "{selected.title}"? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="rounded-[6px]"
                onClick={() => {
                  setShowDelete(false);
                  toast.message('Delete cancelled');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white rounded-[6px]"
                onClick={() => handleDelete(selected._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


