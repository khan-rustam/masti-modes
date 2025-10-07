import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import HamsterLoader from "@/components/hamster-loader"
import { Suspense } from "react"
import { AdminAwareLayout } from "@/components/AdminAwareLayout"
import { Providers } from "@/components/Providers"

export const metadata: Metadata = {
  title: "Masti Mode - Download Free Software",
  description:
    "Discover and download the latest software, tools, and applications. Browse our collection of free software for Windows, Mac, and more.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <HamsterLoader durationMs={1400} />
        <Suspense fallback={<div />}> 
          <Providers>
            <AdminAwareLayout>{children}</AdminAwareLayout>
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
