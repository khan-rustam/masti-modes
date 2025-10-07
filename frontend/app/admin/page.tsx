"use client"
import { useEffect, useState } from 'react'
import { authApi } from '@/lib/api'
import Link from 'next/link'

export default function AdminHome() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        if (res.ok && (res as any).user?.isAdmin) setAuthorized(true)
        else setAuthorized(false)
      })
      .catch(() => setAuthorized(false))
  }, [])

  if (authorized === null) {
    return <div className="py-24 text-center">Checking access…</div>
  }

  if (!authorized) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg">You are not authorized to view this page.</p>
        <Link href="/" className="text-blue-600 underline">Go back home</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dashboard Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Total Applications', value: '6', delta: '+12%' },
          { title: 'New Contacts', value: '2', delta: '+5%' },
          { title: 'Active Projects', value: '0', delta: '+3%' },
          { title: 'Published Blogs', value: '6', delta: '+8%' },
          { title: 'Pending Callbacks', value: '0', delta: '+15%' },
        ].map((c) => (
          <div key={c.title} className="rounded-md border bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{c.title}</div>
            <div className="mt-2 flex items-end gap-2">
              <div className="text-3xl font-semibold">{c.value}</div>
              <div className="text-sm text-green-600">{c.delta}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-4">Users Management</h2>
          <p className="text-sm text-gray-500">Total Users: 5 • Admins: 5 • Active: 5</p>
        </div>
        <div className="rounded-md border bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-4">API Test</h2>
          <ul className="text-sm space-y-2">
            <li><code>GET /api/health</code></li>
            <li><code>GET /api/auth/me</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}


