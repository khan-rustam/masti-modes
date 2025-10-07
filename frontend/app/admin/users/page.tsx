"use client"
import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import Icon from "@/components/AppIcons";
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Pencil, Shield, User as UserIcon, CheckCircle, XCircle, ArrowUpRightFromCircle, ArrowDownRight, Trash2, RefreshCw } from 'lucide-react'

type User = {
  _id: string
  name: string
  email: string
  isAdmin?: boolean
  isActive?: boolean
  createdAt?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', isActive: true as boolean })
  const [busy, setBusy] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const res = await adminApi.listUsers()
      setUsers(res.users || [])
    } catch (e) {
      toast({ title: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
      const role = u.isAdmin ? 'admin' : 'user'
      const status = u.isActive !== false ? 'active' : 'inactive'
      const matchRole = roleFilter === 'all' || role === roleFilter
      const matchStatus = statusFilter === 'all' || status === statusFilter
      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const stats = useMemo(() => {
    const total = users.length
    const admins = users.filter(u => u.isAdmin).length
    const act = users.filter(u => u.isActive !== false).length
    return { total, admins, users: total - admins, active: act, inactive: total - act }
  }, [users])

  function resetForm() {
    setForm({ name: '', email: '', password: '', role: 'user', isActive: true })
    setSelected(null)
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    try {
      setBusy(true)
      await adminApi.createUser({ name: form.name, email: form.email, password: form.password, role: form.role as any, isActive: form.isActive })
      toast({ title: 'User created' })
      setShowCreate(false); resetForm(); load()
    } catch { toast({ title: 'Failed to create user' }) } finally { setBusy(false) }
  }

  async function updateUser(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    try {
      setBusy(true)
      await adminApi.updateUser(selected._id, { name: form.name, email: form.email, password: form.password || undefined, role: form.role as any, isActive: form.isActive })
      toast({ title: 'User updated' })
      setShowEdit(false); resetForm(); load()
    } catch { toast({ title: 'Failed to update user' }) } finally { setBusy(false) }
  }

  async function toggleActive(u: User) {
    try { await adminApi.updateUser(u._id, { isActive: !(u.isActive !== false) }); load(); toast({ title: (u.isActive !== false) ? 'User deactivated' : 'User activated' }) } catch { }
  }

  async function promoteDemote(u: User) {
    try { await adminApi.updateUser(u._id, { role: u.isAdmin ? 'user' : 'admin' }); load(); toast({ title: u.isAdmin ? 'Demoted' : 'Promoted' }) } catch { }
  }

  async function deleteUser() {
    if (!selected) return
    try { setBusy(true); await adminApi.deleteUser(selected._id); setShowDelete(false); resetForm(); load(); toast({ title: 'User deleted' }) } catch { toast({ title: 'Failed to delete' }) } finally { setBusy(false) }
  }

  return (
    <div className="space-y-8">
      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: stats.total, icon: UserIcon, bg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Admins', val: stats.admins, icon: Shield, bg: 'bg-purple-100', iconColor: 'text-purple-600' },
          { label: 'Active', val: stats.active, icon: CheckCircle, bg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
          { label: 'Inactive', val: stats.inactive, icon: XCircle, bg: 'bg-red-100', iconColor: 'text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-md p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                <p className="text-2xl font-bold text-slate-800">{card.val}</p>
              </div>
              <div className={`w-12 h-12 rounded-[10px] ${card.bg} flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="px-3 py-2 border border-slate-200 rounded-md">
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2 border border-slate-200 rounded-md">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="rounded-[6px] cursor-pointer hover:bg-slate-50 hover:text-slate-800" onClick={load}>
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh users</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-[6px] cursor-pointer" onClick={() => { resetForm(); setShowCreate(true) }}>Create User</Button>
            </TooltipTrigger>
            <TooltipContent>Create a new user</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">User</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">Role</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">Joined</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-sm flex items-center justify-center">
                          <Icon
                            name="User"
                            size={20}
                            className="text-white"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-slate-800">
                              {u.name}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${u.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{u.isAdmin ? 'admin' : 'user'}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(u.isActive !== false) ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{(u.isActive !== false) ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600 text-center">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-600 rounded-[6px] cursor-pointer" onClick={() => { setSelected(u); setForm({ name: u.name, email: u.email, password: '', role: u.isAdmin ? 'admin' : 'user', isActive: u.isActive !== false }); setShowEdit(true) }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit user</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className={(u.isAdmin ? 'border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-600' : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-600') + ' rounded-[6px] cursor-pointer'} onClick={() => promoteDemote(u)}>
                              {u.isAdmin ? (<><ArrowDownRight className="h-4 w-4" /> </>) : (<><ArrowUpRightFromCircle className="h-4 w-4" /> </>)}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{u.isAdmin ? 'Demote to user' : 'Promote to admin'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className={((u.isActive !== false) ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600') + ' rounded-[6px] cursor-pointer'} onClick={() => toggleActive(u)}>
                              {(u.isActive !== false) ? (<><XCircle className="h-4 w-4" /> </>) : (<><CheckCircle className="h-4 w-4" /> </>)}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{(u.isActive !== false) ? 'Deactivate user' : 'Activate user'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600 rounded-[6px] cursor-pointer" onClick={() => { setSelected(u); setShowDelete(true) }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete user</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-600">No users found</div>
            )}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Create User</h3><button onClick={() => setShowCreate(false)} className="p-2 rounded-md hover:bg-slate-100">✕</button></div>
            <form onSubmit={createUser} className="space-y-3">
              <input required className="w-full px-3 py-2 border rounded-md" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input required type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input required className="w-full px-3 py-2 border rounded-md" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border rounded-md" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button disabled={busy} className="bg-orange-500 hover:bg-orange-600 text-white flex-1 rounded-[6px] cursor-pointer">Create</Button>
                <Button type="button" variant="outline" className="flex-1 rounded-[6px] cursor-pointer" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Edit User</h3><button onClick={() => setShowEdit(false)} className="p-2 rounded-md hover:bg-slate-100">✕</button></div>
            <form onSubmit={updateUser} className="space-y-3">
              <input required className="w-full px-3 py-2 border rounded-md" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input required type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input className="w-full px-3 py-2 border rounded-md" placeholder="New password (optional)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border rounded-md" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button disabled={busy} className="bg-orange-500 hover:bg-orange-600 text-white flex-1 rounded-[6px] cursor-pointer">Update</Button>
                <Button type="button" variant="outline" className="flex-1 rounded-[6px] cursor-pointer" onClick={() => setShowEdit(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDelete && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-6 w-full max-w-sm mx-4">
            <h3 className="font-semibold mb-2">Delete User</h3>
            <p className="text-sm text-slate-600 mb-4">Are you sure you want to delete {selected.name}? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Button disabled={busy} className="bg-red-600 hover:bg-red-700 text-white flex-1 rounded-[6px] cursor-pointer" onClick={deleteUser}>Delete</Button>
              <Button variant="outline" className="flex-1 rounded-[6px] cursor-pointer" onClick={() => setShowDelete(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


