"use client"
import { useEffect, useMemo, useState } from 'react'
import { categoryApi } from '@/lib/api'
import { toast } from 'sonner'
import Icon from '@/components/AppIcons'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type Category = { _id: string; title: string; description?: string; isActive?: boolean; createdAt?: string }

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ title: '', description: '', isActive: true })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const res = await categoryApi.list()
      setItems(res.categories || [])
    } catch { toast.error('Failed to load categories') } finally { setLoading(false) }
  }

  function startCreate() { setEditing(null); setForm({ title: '', description: '', isActive: true }); setShowForm(true) }
  function startEdit(cat: Category) { setEditing(cat);
    setForm({ title: cat.title, description: cat.description || '', isActive: cat.isActive !== false }); setShowForm(true) }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault(); if (busy) return
    if (!form.title.trim()) return toast.warning('Title is required')
    try {
      setBusy(true)
      if (editing) await categoryApi.update(editing._id, { title: form.title.trim(), description: form.description.trim() || undefined, isActive: form.isActive })
      else await categoryApi.create({ title: form.title.trim(), description: form.description.trim() || undefined, isActive: form.isActive })
      toast.success(editing ? 'Category updated' : 'Category created')
      setShowForm(false); setEditing(null); setForm({ title: '', description: '', isActive: true }); load()
    } catch (e: any) { toast.error(e?.data?.error || 'Failed to save category') } finally { setBusy(false) }
  }

  async function remove(cat: Category) {
    if (!confirm(`Delete category "${cat.title}"?`)) return
    try { await categoryApi.delete(cat._id); toast.success('Category deleted'); load() } catch { toast.error('Failed to delete') }
  }

  const stats = useMemo(() => ({ total: items.length }), [items])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-slate-600">Create and manage software categories</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-[6px]" onClick={startCreate}>New Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ label: 'Total', val: stats.total, icon: 'Folder' }].map(c => (
          <div key={c.label} className="bg-white rounded-md p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{c.label}</p>
                <p className="text-2xl font-bold text-slate-800">{c.val}</p>
              </div>
              <div className="w-12 h-12 rounded-[10px] bg-slate-100 flex items-center justify-center">
                <Icon name={c.icon as any} size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map(cat => (
                  <tr key={cat._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-800">{cat.title}</div>
                      {cat.description && <div className="text-sm text-slate-500 line-clamp-1 max-w-[420px]">{cat.description}</div>}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cat.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{cat.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">{cat.createdAt ? new Date(cat.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" className="rounded-[6px]" onClick={() => startEdit(cat)}>Edit</Button>
                        <Button variant="outline" className="rounded-[6px]" onClick={() => remove(cat)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <div className="p-8 text-center text-slate-600">No categories found</div>}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editing ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-md hover:bg-slate-100">✕</button>
            </div>
            <form onSubmit={submitForm} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Education Software" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required />
              </div>
              <div>
                <label className="text-sm font-medium">Description (optional)</label>
                <textarea className="w-full px-3 py-2 border rounded-md" placeholder="Short description" rows={3} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              
              <div className="flex items-center gap-2">
                <input id="active" type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                <label htmlFor="active" className="text-sm">Active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button disabled={busy} className="bg-orange-500 hover:bg-orange-600 text-white flex-1 rounded-[6px]">{editing ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" className="flex-1 rounded-[6px]" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


