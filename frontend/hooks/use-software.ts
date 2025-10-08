import { useState, useEffect } from 'react'
import { publicSoftwareApi } from '@/lib/api'

export interface Software {
  _id: string
  title: string
  description: string
  categoryId: string
  categoryTitle: string
  type: 'pc' | 'mobile'
  version: string
  vendor: string
  website: string
  license: string
  downloadLink: string
  altDownloadLink: string
  thumbnailUrl: string
  images: Array<{
    url: string
    public_id?: string
    width?: number
    height?: number
    bytes?: number
    format?: string
    folder?: string
  }>
  tags: string[]
  rating: number
  downloads: number
  releaseDate: string
  sizeMB: string
  osSupport: string
  notes: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function useSoftware() {
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSoftware()
  }, [])

  const fetchSoftware = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await publicSoftwareApi.list({ limit: 50 })
      if (response.ok) {
        setSoftware(response.software)
      } else {
        setError('Failed to fetch software')
      }
    } catch (err) {
      setError('Failed to fetch software')
      console.error('Error fetching software:', err)
    } finally {
      setLoading(false)
    }
  }

  return { software, loading, error, refetch: fetchSoftware }
}

export function useLatestSoftware(limit = 6) {
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLatest()
  }, [limit])

  const fetchLatest = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await publicSoftwareApi.getLatest(limit)
      if (response.ok) {
        setSoftware(response.software)
      } else {
        setError('Failed to fetch latest software')
      }
    } catch (err) {
      setError('Failed to fetch latest software')
      console.error('Error fetching latest software:', err)
    } finally {
      setLoading(false)
    }
  }

  return { software, loading, error, refetch: fetchLatest }
}

export function useMostDownloadedSoftware(limit = 6) {
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMostDownloaded()
  }, [limit])

  const fetchMostDownloaded = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await publicSoftwareApi.getMostDownloaded(limit)
      if (response.ok) {
        setSoftware(response.software)
      } else {
        setError('Failed to fetch most downloaded software')
      }
    } catch (err) {
      setError('Failed to fetch most downloaded software')
      console.error('Error fetching most downloaded software:', err)
    } finally {
      setLoading(false)
    }
  }

  return { software, loading, error, refetch: fetchMostDownloaded }
}

export function useRecentlyUpdatedSoftware(limit = 6) {
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentlyUpdated()
  }, [limit])

  const fetchRecentlyUpdated = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await publicSoftwareApi.getRecentlyUpdated(limit)
      if (response.ok) {
        setSoftware(response.software)
      } else {
        setError('Failed to fetch recently updated software')
      }
    } catch (err) {
      setError('Failed to fetch recently updated software')
      console.error('Error fetching recently updated software:', err)
    } finally {
      setLoading(false)
    }
  }

  return { software, loading, error, refetch: fetchRecentlyUpdated }
}

export function useSoftwareById(id: string) {
  const [software, setSoftware] = useState<Software | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchSoftwareById(id)
    }
  }, [id])

  const fetchSoftwareById = async (softwareId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await publicSoftwareApi.getById(softwareId)
      if (response.ok) {
        setSoftware(response.software)
      } else {
        setError('Software not found')
      }
    } catch (err) {
      setError('Failed to fetch software')
      console.error('Error fetching software:', err)
    } finally {
      setLoading(false)
    }
  }

  return { software, loading, error, refetch: () => fetchSoftwareById(id) }
}
