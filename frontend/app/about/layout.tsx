import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Masti Mode",
  description: "Learn more about Masti Mode, your trusted source for downloading the latest software and applications.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
