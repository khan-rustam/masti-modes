import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SoftwareDetailClient } from "@/components/software-detail-client"
import { getSoftwareById, softwareData } from "@/lib/software-data"

interface SoftwarePageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  return softwareData.map((software) => ({
    id: software.id,
  }))
}

export async function generateMetadata({ params }: SoftwarePageProps): Promise<Metadata> {
  const software = getSoftwareById(params.id)

  if (!software) {
    return {
      title: "Software Not Found",
    }
  }

  return {
    title: `${software.name} ${software.version} - Download Free | Masti Mode`,
    description: software.longDescription,
  }
}

export default function SoftwarePage({ params }: SoftwarePageProps) {
  const software = getSoftwareById(params.id)

  if (!software) {
    notFound()
  }

  return <SoftwareDetailClient software={software} />
}
