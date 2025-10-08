"use client"

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, SortDesc, Grid, List, Star, Download, Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { SoftwareCard } from '@/components/software-card'
import { useSoftware } from '@/hooks/use-software'
import { publicSoftwareApi } from '@/lib/api'
import { toast } from 'sonner'

interface FilterState {
  search: string
  type: 'all' | 'pc' | 'mobile'
  category: string
  license: string
  rating: [number, number]
  downloads: [number, number]
  sortBy: 'title' | 'rating' | 'downloads' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const { software: allSoftware, loading: initialLoading } = useSoftware()
  const [filteredSoftware, setFilteredSoftware] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    type: 'all',
    category: 'all',
    license: 'all',
    rating: [0, 5],
    downloads: [0, 10000000],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const [categories, setCategories] = useState<any[]>([])
  const [licenses, setLicenses] = useState<string[]>([])

  // Fetch categories and extract unique licenses
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicSoftwareApi.list({ limit: 1000 })
        if (response.ok) {
          const uniqueCategories = [...new Set(response.software.map(s => s.categoryTitle))].map(title => ({ title }))
          const uniqueLicenses = [...new Set(response.software.map(s => s.license).filter(Boolean))]
          setCategories(uniqueCategories)
          setLicenses(uniqueLicenses)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Update search when URL parameter changes
  useEffect(() => {
    const searchParam = searchParams.get('search')
    if (searchParam && searchParam !== filters.search) {
      setFilters(prev => ({ ...prev, search: searchParam }))
    }
  }, [searchParams, filters.search])

  // Filter and sort software
  const filteredAndSortedSoftware = useMemo(() => {
    let filtered = allSoftware.filter(software => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!software.title.toLowerCase().includes(searchLower) && 
            !software.description.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Type filter
      if (filters.type !== 'all' && software.type !== filters.type) {
        return false
      }

      // Category filter
      if (filters.category !== 'all' && software.categoryTitle !== filters.category) {
        return false
      }

      // License filter
      if (filters.license !== 'all' && software.license !== filters.license) {
        return false
      }

      // Rating filter
      if (software.rating < filters.rating[0] || software.rating > filters.rating[1]) {
        return false
      }

      // Downloads filter
      if (software.downloads < filters.downloads[0] || software.downloads > filters.downloads[1]) {
        return false
      }

      return true
    })

    // Sort software
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'downloads':
          aValue = a.downloads
          bValue = b.downloads
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [allSoftware, filters])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      license: 'all',
      rating: [0, 5],
      downloads: [0, 10000000],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 ">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 border-b border-white/20 sticky top-0 z-40 pt-16">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Browse Software</h1>
              <p className="text-white/80 mt-1">Discover and download the best software</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-white text-blue-600 hover:bg-white/90' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-white text-blue-600 hover:bg-white/90' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search software..."
                      value={filters.search}
                      onChange={(e) => updateFilter('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pc">PC Software</SelectItem>
                      <SelectItem value="mobile">Mobile Apps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat, index) => (
                        <SelectItem key={index} value={cat.title}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* License Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">License</label>
                  <Select value={filters.license} onValueChange={(value) => updateFilter('license', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Licenses</SelectItem>
                      {licenses.map((license, index) => (
                        <SelectItem key={index} value={license}>
                          {license}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rating: {filters.rating[0]} - {filters.rating[1]}
                  </label>
                  <Slider
                    value={filters.rating}
                    onValueChange={(value) => updateFilter('rating', value)}
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Downloads Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Downloads: {formatNumber(filters.downloads[0])} - {formatNumber(filters.downloads[1])}
                  </label>
                  <Slider
                    value={filters.downloads}
                    onValueChange={(value) => updateFilter('downloads', value)}
                    min={0}
                    max={10000000}
                    step={100000}
                    className="w-full"
                  />
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Added</SelectItem>
                      <SelectItem value="title">Name</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.sortOrder === 'asc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('sortOrder', 'asc')}
                      className="flex-1"
                    >
                      <SortAsc className="h-4 w-4 mr-1" />
                      Asc
                    </Button>
                    <Button
                      variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('sortOrder', 'desc')}
                      className="flex-1"
                    >
                      <SortDesc className="h-4 w-4 mr-1" />
                      Desc
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {filteredAndSortedSoftware.length} Software Found
              </h2>
              <p className="text-slate-600 text-sm">
                {filters.search && (
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Searching for "{filters.search}"
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => updateFilter('search', '')}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </Button>
                  </span>
                )}
              </p>
            </div>
            </div>

            {/* Software Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedSoftware.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No software found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredAndSortedSoftware.map((software, index) => (
                  <motion.div
                    key={software._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <SoftwareCard software={software} index={index} />
                    ) : (
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={software.thumbnailUrl || "/placeholder.jpg"} 
                                alt={software.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                    {software.title}
                                  </h3>
                                  <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                                    {software.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span>{software.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Download className="h-4 w-4" />
                                      <span>{formatNumber(software.downloads)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {software.type === 'pc' ? (
                                        <Monitor className="h-4 w-4" />
                                      ) : (
                                        <Smartphone className="h-4 w-4" />
                                      )}
                                      <span className="uppercase">{software.type}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge variant="secondary">{software.categoryTitle}</Badge>
                                  <Badge variant="outline">{software.license}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
