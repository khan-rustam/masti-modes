"use client"

import { useSoftwareById } from "@/hooks/use-software"
import { SoftwareDetailClient } from "@/components/software-detail-client"
import { notFound } from "next/navigation"

interface SoftwarePageProps {
  params: {
    id: string
  }
}

export default function SoftwarePage({ params }: SoftwarePageProps) {
  const { software, loading, error } = useSoftwareById(params.id)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !software) {
    notFound()
  }

  return <SoftwareDetailClient software={software} />
}
