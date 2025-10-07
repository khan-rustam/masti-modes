"use client"
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Icon from '@/components/AppIcons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { contactApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

type Contact = {
  _id: string
  fullName?: string
  name?: string
  email?: string
  phone?: string
  subject?: string
  status?: 'new' | 'contacted' | 'in-progress' | 'closed' | 'archived'
  isRead?: boolean
  description?: string
  createdAt?: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    subject: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  })
  const [pagination, setPagination] = useState<any>({})
  const [stats, setStats] = useState<any>({})
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadContacts()
    loadStats()
  }, [filters])

  async function loadContacts() {
    try {
      setLoading(true)
      const res = await contactApi.getAll(filters)
      setContacts(res.contacts || [])
      setPagination(res.pagination || {})
    } catch (e) {
      toast({ title: 'Failed to load contacts' })
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const res = await contactApi.getStats()
      setStats(res || {})
    } catch { }
  }

  function handleFilterChange(key: string, value: any) {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  async function handleStatusUpdate(contactId: string, newStatus: Contact['status']) {
    try {
      await contactApi.update(contactId, { status: newStatus as any })
      toast({ title: 'Contact status updated' })
      loadContacts(); loadStats()
    } catch { toast({ title: 'Failed to update status' }) }
  }

  async function handleReadStatusUpdate(contactId: string, isRead?: boolean) {
    try {
      await contactApi.update(contactId, { isRead: !isRead })
      toast({ title: `Marked as ${!isRead ? 'read' : 'unread'}` })
      loadContacts(); loadStats()
    } catch { toast({ title: 'Failed to update read status' }) }
  }



  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      if (deleteTarget.type === 'bulk') {
        await contactApi.bulkDelete(deleteTarget.ids)
      } else {
        await contactApi.delete(deleteTarget.id)
      }
      toast({ title: 'Deleted successfully' })

      setShowDeleteModal(false)
      setDeleteTarget(null)
      loadContacts(); loadStats()
    } catch { toast({ title: 'Failed to delete' }) } finally { setIsDeleting(false) }
  }



  function getSubjectColor(subject?: string) {
    const map: Record<string, string> = {
      'hire-us': 'bg-green-100 text-green-800',
      'join-us': 'bg-blue-100 text-blue-800',
      partnership: 'bg-purple-100 text-purple-800',
      'general-inquiry': 'bg-gray-100 text-gray-800',
      support: 'bg-orange-100 text-orange-800',
      feedback: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return map[subject || 'other'] || 'bg-gray-100 text-gray-800'
  }

  const formatted = useMemo(() => contacts.map(c => ({ c, f: contactApi.formatContactData(c) })), [contacts])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600">Manage contact form submissions and inquiries</p>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/50 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Icon name="MessageCircle" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Total Contacts</p>
              <p className="text-3xl font-bold text-blue-900">{stats.overview?.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200/50 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
              <Icon name="Clock" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-700">New</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.overview?.new || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200/50 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <Icon name="Users" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-700">In Progress</p>
              <p className="text-3xl font-bold text-purple-900">{stats.overview?.inProgress || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200/50 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Icon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Closed</p>
              <p className="text-3xl font-bold text-green-900">{stats.overview?.closed || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200/50 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
            <Icon name="Filter" size={18} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Filter Contacts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Search by name, email or subject..." className="bg-white border-slate-300 focus:border-primary focus:ring-primary w-full px-3 py-2 rounded-md border" />
          <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="bg-white border-slate-300 focus:border-primary focus:ring-primary w-full px-3 py-2 rounded-md border">
            {contactApi.getStatusOptions().map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
          <select value={filters.subject} onChange={e => handleFilterChange('subject', e.target.value)} className="bg-white border-slate-300 focus:border-primary focus:ring-primary w-full px-3 py-2 rounded-md border">
            {contactApi.getSubjectOptions().map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
          <div className="flex items-end">
            <Button variant="outline" onClick={() => setFilters({ search: '', status: '', subject: '', page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })} className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700">
              <Icon name="RotateCcw" size={16} className="mr-2" /> Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">Loading contacts…</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">No contacts found</td></tr>
              ) : (
                formatted.map(({ c, f }) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900">{f.fullName}</div>
                        <div className="text-sm text-slate-500">{f.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSubjectColor(c.subject)}`}>{f.subjectLabel}</span></td>
                    <td className="px-6 py-4">
                      <select value={c.status} onChange={e => handleStatusUpdate(c._id, e.target.value as any)} className="w-32 px-3 py-2 text-sm font-medium rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all duration-200 cursor-pointer">
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{f.formattedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => { setSelectedContact(c); setShowContactModal(true) }} className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-200">
                              <Icon name="Eye" size={14} className="text-blue-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleReadStatusUpdate(c._id, c.isRead)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${c.isRead ? 'bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300' : 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-300'}`}>
                              <Icon name={c.isRead ? 'Check' : 'Mail'} size={14} className={c.isRead ? 'text-green-600' : 'text-yellow-600'} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{c.isRead ? 'Mark as Unread' : 'Mark as Contacted'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => window.open(`mailto:${c.email}?subject=Re: ${f.subjectLabel} - ${f.fullName}`)} className="w-8 h-8 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-lg flex items-center justify-center transition-all duration-200">
                              <Icon name="Mail" size={14} className="text-blue-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Reply via Email</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => { setDeleteTarget({ type: 'single', id: c._id }); setShowDeleteModal(true) }} className="w-8 h-8 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-lg flex items-center justify-center transition-all duration-200">
                              <Icon name="Trash2" size={14} className="text-red-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Contact</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalContacts)} of {pagination.totalContacts} results
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleFilterChange('page', pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}>Previous</Button>
            <Button variant="outline" onClick={() => handleFilterChange('page', pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>Next</Button>
          </div>
        </div>
      )}

      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Icon name="User" size={20} className="text-white" /></div>
                <div>
                  <h3 className="text-xl font-semibold">Contact Details</h3>
                  <p className="text-white/80 text-sm">Submitted on {new Date(selectedContact.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowContactModal(false)} className="text-black border-black border-2 hover:bg-black hover:text-white">Close</Button>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2"><Icon name="User" size={18} className="text-blue-600" /><span>Contact Information</span></h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-blue-700">Full Name</label><p className="text-blue-900 font-medium text-lg">{selectedContact.fullName || selectedContact.name}</p></div>
                  <div><label className="text-sm font-medium text-blue-700">Email</label><p className="text-blue-900 font-medium">{selectedContact.email}</p></div>
                  <div><label className="text-sm font-medium text-blue-700">Phone</label><p className="text-blue-900 font-medium">{selectedContact.phone}</p></div>
                  <div><label className="text-sm font-medium text-blue-700">Subject</label><span className={`inline-flex px-3 py-1 ml-2 text-sm font-medium rounded-full ${getSubjectColor(selectedContact.subject)}`}>{contactApi.formatContactData(selectedContact).subjectLabel}</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200/50">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2"><Icon name="MessageCircle" size={18} className="text-green-600" /><span>Message</span></h4>
                <div className="bg-white rounded-lg p-4 border border-green-200"><p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedContact.description}</p></div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600 flex items-center space-x-2"><Icon name="Shield" size={16} className="text-gray-500" /><span>Contact ID: {selectedContact._id?.slice(-8)}</span></div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowContactModal(false)} className="border-gray-300">Close</Button>
                <Button variant="default" onClick={() => { if (!selectedContact.isRead) handleReadStatusUpdate(selectedContact._id, selectedContact.isRead); setShowContactModal(false) }} className="bg-primary">Mark as Read</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-lg mb-2">Delete Contact</h3>
            <p className="text-sm text-slate-600 mb-4">{deleteTarget?.type === 'bulk' ? `Are you sure you want to delete ${deleteTarget.ids.length} selected contacts? This action cannot be undone.` : 'Are you sure you want to delete this contact? This action cannot be undone.'}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


