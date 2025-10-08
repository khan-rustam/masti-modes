type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const BASE_API = process.env.NEXT_PUBLIC_BASE_API

function buildUrl(path: string): string {
    if (!path.startsWith('/')) path = `/${path}`
    if (BASE_API && BASE_API.length > 0) return `${BASE_API}${path}`
    return path
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = buildUrl(path)
    const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    })
    const contentType = res.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await res.json() : (await res.text() as unknown as T)
    if (!res.ok) throw Object.assign(new Error('Request failed'), { status: res.status, data })
    return data as T
}

export const api = {
    baseUrl: BASE_API,
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
    patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

// Auth endpoints
export const authApi = {
    register: (payload: { name: string; email: string; password: string }) =>
        api.post<{ ok: boolean; error?: string }>('/api/auth/register', payload),
    login: (payload: { email: string; password: string }) =>
        api.post<{ ok: boolean; error?: string }>('/api/auth/login', payload),
    logout: () => api.post<{ ok: boolean }>('/api/auth/logout'),
    me: () => api.get<{ ok: boolean; user?: unknown }>('/api/auth/me'),
}

// Admin endpoints
export const adminApi = {
  listUsers: () => api.get<{ ok: boolean; users: any[] }>('/api/auth/admin/users'),
  createUser: (payload: { name: string; email: string; password: string; role?: 'user' | 'admin'; isActive?: boolean }) =>
    api.post<{ ok: boolean; user: any }>('/api/auth/admin/users', payload),
  updateUser: (id: string, payload: Partial<{ name: string; email: string; password: string; role: 'user' | 'admin'; isActive: boolean }>) =>
    api.put<{ ok: boolean; user: any }>(`/api/auth/admin/users/${id}`, payload),
  deleteUser: (id: string) => api.delete<{ ok: boolean }>(`/api/auth/admin/users/${id}`),
}


// Contacts endpoints (admin)
export const contactApi = {
  // List contacts with filters and pagination
  getAll: (filters: Partial<{
    search: string
    status: string
    subject: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }>) => {
    const params = new URLSearchParams()
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v))
    })
    return api.get<{ ok: boolean; contacts: any[]; pagination: any }>(`/api/admin/contacts?${params.toString()}`)
  },
  // Public: submit contact form
  submit: (payload: { fullName?: string; name?: string; email: string; phone?: string; subject: string; description: string }) =>
    api.post<{ ok: boolean; contact: any }>(`/api/admin/contacts`, payload),
  // Aggregate stats
  getStats: () => api.get<{ ok: boolean; overview?: { total: number; new: number; inProgress: number; closed: number } }>(`/api/admin/contacts/stats`),
  // Update a single contact
  update: (id: string, payload: Partial<{ status: string; isRead: boolean }>) =>
    api.put<{ ok: boolean; contact: any }>(`/api/admin/contacts/${id}`, payload),
  // Delete a single contact
  delete: (id: string) => api.delete<{ ok: boolean }>(`/api/admin/contacts/${id}`),
  // Bulk operations
  bulkUpdate: (ids: string[], payload: Partial<{ status: string }>) =>
    api.post<{ ok: boolean }>(`/api/admin/contacts/bulk-update`, { ids, ...payload }),
  bulkDelete: (ids: string[]) => api.post<{ ok: boolean }>(`/api/admin/contacts/bulk-delete`, { ids }),
  // Helpers for UI formatting
  getStatusOptions: (): { label: string; value: string }[] => [
    { label: 'All Statuses', value: '' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Closed', value: 'closed' },
    { label: 'Archived', value: 'archived' },
  ],
  getSubjectOptions: (): { label: string; value: string }[] => [
    { label: 'All Subjects', value: '' },
    { label: 'Request Software', value: 'request-software' },
    { label: 'Report Broken Link', value: 'report-broken-link' },
    { label: 'Premium Access', value: 'premium-access' },
    { label: 'General Inquiry', value: 'general-inquiry' },
    { label: 'Mobile Apps', value: 'mobile-apps' },
    { label: 'Games', value: 'games' },
    { label: 'Feedback', value: 'feedback' },
    { label: 'Other', value: 'other' },
  ],
  formatContactData: (c: any) => {
    const subjects: Record<string, string> = {
      'request-software': 'Request Software',
      'report-broken-link': 'Report Broken Link',
      'premium-access': 'Premium Access',
      'general-inquiry': 'General Inquiry',
      'mobile-apps': 'Mobile Apps',
      games: 'Games',
      feedback: 'Feedback',
      other: 'Other',
      // legacy support
      'hire-us': 'Hire Us',
      'join-us': 'Join Us',
      partnership: 'Partnership',
      support: 'Support',
    }
    return {
      fullName: c?.fullName || c?.name || 'Unknown',
      email: c?.email || '-',
      phone: c?.phone || '-',
      subjectLabel: subjects[c?.subject] || 'Other',
      formattedDate: c?.createdAt ? new Date(c.createdAt).toLocaleString() : '-',
    }
  },
}

// Categories endpoints (admin)
export const categoryApi = {
  list: () => api.get<{ ok: boolean; categories: any[] }>(`/api/admin/categories`),
  create: (payload: { title: string; description?: string; isActive?: boolean }) =>
    api.post<{ ok: boolean; category: any }>(`/api/admin/categories`, payload),
  update: (id: string, payload: Partial<{ title: string; description?: string; isActive: boolean }>) =>
    api.put<{ ok: boolean; category: any }>(`/api/admin/categories/${id}`, payload),
  delete: (id: string) => api.delete<{ ok: boolean }>(`/api/admin/categories/${id}`),
}

// Software endpoints (admin)
export const softwareApi = {
  list: (params: Partial<{ search: string; type: 'pc' | 'mobile' | ''; categoryId: string; page: number; limit: number }>) => {
    const qs = new URLSearchParams()
    Object.entries(params || {}).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, String(v)) })
    return api.get<{ ok: boolean; software: any[]; pagination: any }>(`/api/admin/software?${qs.toString()}`)
  },
  create: (payload: any) => api.post<{ ok: boolean; software: any }>(`/api/admin/software`, payload),
  update: (id: string, payload: any) => api.put<{ ok: boolean; software: any }>(`/api/admin/software/${id}`, payload),
  delete: (id: string) => api.delete<{ ok: boolean }>(`/api/admin/software/${id}`),
}

// Public software endpoints
export const publicSoftwareApi = {
  list: (params: Partial<{ search: string; type: 'pc' | 'mobile' | ''; categoryId: string; page: number; limit: number; sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
    const qs = new URLSearchParams()
    Object.entries(params || {}).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') qs.append(k, String(v)) })
    return api.get<{ ok: boolean; software: any[]; pagination: any }>(`/api/software?${qs.toString()}`)
  },
  getById: (id: string) => api.get<{ ok: boolean; software: any }>(`/api/software/${id}`),
  getLatest: (limit = 6) => api.get<{ ok: boolean; software: any[] }>(`/api/software/latest?limit=${limit}`),
  getMostDownloaded: (limit = 6) => api.get<{ ok: boolean; software: any[] }>(`/api/software/most-downloaded?limit=${limit}`),
  getRecentlyUpdated: (limit = 6) => api.get<{ ok: boolean; software: any[] }>(`/api/software/recently-updated?limit=${limit}`),
}


