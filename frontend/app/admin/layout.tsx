"use client"
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { authApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  TestTube,
  FileText,
  FolderOpen,
  Briefcase,
  UserCheck,
  Building2,
  Handshake,
  HelpCircle,
  UserPlus,
  Mail,
  Phone,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarNavRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    authApi.me().then((r) => {
      if (r.ok && (r as any).user?.isAdmin) { setAuthed(true); setIsAdmin(true) } else setAuthed(false)
    }).catch(() => setAuthed(false))
  }, [])

  // persist sidebar scroll
  useEffect(() => {
    const saved = Number(sessionStorage.getItem('adminSidebarScroll') || 0)
    if (sidebarNavRef.current) sidebarNavRef.current.scrollTop = saved
    const onScroll = () => {
      if (!sidebarNavRef.current) return
      sessionStorage.setItem('adminSidebarScroll', String(sidebarNavRef.current.scrollTop))
    }
    const el = sidebarNavRef.current
    el?.addEventListener('scroll', onScroll)
    return () => el?.removeEventListener('scroll', onScroll)
  }, [])

  if (authed === null) return <div className="py-24 text-center">Loading…</div>
  if (!authed || !isAdmin) return <div className="py-24 text-center">Not authorized</div>

  const nav = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'API Test', href: '/admin/api', icon: TestTube },
    { name: 'Blogs', href: '#', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Software', href: '/admin/software', icon: Briefcase },
    { name: 'Contacts', href: '/admin/contacts', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900">
      {/* mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* fixed sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-white dark:bg-neutral-950 shadow-2xl border-r border-slate-200/60 dark:border-neutral-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo and user */}
          <div className="flex items-center h-16 px-6 border-b border-slate-200/60 dark:border-neutral-800 bg-gradient-to-r from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-950">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={"/logo/logo-dark.png"}
                alt="Masti Mode"
                width={140}
                height={26}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-2 rounded-md hover:bg-slate-100">
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Nav */}
          <nav ref={sidebarNavRef} className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {nav.map((item) => (
              <Link key={item.name} href={item.href} className="flex items-center justify-between rounded-[6px] px-3 py-2 hover:bg-orange-50 dark:hover:bg-neutral-800 group">
                <span className="flex items-center gap-3 text-slate-700 dark:text-neutral-200">
                  <item.icon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">{item.name}</span>
                </span>
                
              </Link>
            ))}
          </nav>

          {/* logout */}
          <div className="px-3 py-4 border-t border-slate-200/60 dark:border-neutral-800 bg-gradient-to-r from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-950">
            <button onClick={async () => { try { await authApi.logout(); toast({ title: 'Signed out' }); window.location.href = '/' } catch { } }} className="w-full inline-flex items-center justify-center gap-2 rounded-[6px] border border-orange-200 text-orange-600 hover:text-orange-700 bg-white hover:bg-orange-50 px-3 py-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* main content with left gutter for sidebar */}
      <div className="lg:ml-56">
        {/* top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-neutral-950 border-b border-slate-200/60 dark:border-neutral-800">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-[6px] hover:bg-slate-100 dark:hover:bg-neutral-800"><Menu className="h-5 w-5 text-slate-700 dark:text-neutral-200" /></button>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">Dashboard Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Quick actions */}
              <Link
                href={'/'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-slate-500 dark:text-neutral-300 hover:text-orange-600 rounded-[6px] hover:bg-orange-50 dark:hover:bg-neutral-800 transition-all duration-300"
                title="View Website"
              >
                <Home className="h-5 w-5" />
              </Link>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <Button
                  onClick={async () => { try { await authApi.logout(); toast({ title: 'Signed out' }); window.location.href = '/' } catch { } }}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-[6px] cursor-pointer"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* page content */}
        <main className="min-h-screen p-6 bg-slate-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  )
}


