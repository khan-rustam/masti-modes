"use client"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function AdminAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminArea = pathname?.startsWith('/admin')
  return (
    <>
      {!isAdminArea && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdminArea && <Footer />}
    </>
  )
}


