'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import EventList from '@/components/events/EventList'
import Layout from "@/components/layout/Layout"

// Sample events data
// const sampleEvents = [
//   {
//     id: 1,
//     title: "Jakarta International Marathon 2024",
//     location: "Gelora Bung Karno, Jakarta",
//     date: "15 Des 2024",
//     participants: "2.5k",
//     price: 250000,
//     type: "marathon",
//     badge: "Coming Soon",
//     image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop",
//     categories: ["Marathon", "City Run"],
//     difficulty: "Expert",
//     organizer: "Jakarta Running Foundation",
//     earlyBird: true,
//     earlyBirdPrice: 200000
//   },
//   {
//     id: 2,
//     title: "Virtual Run Challenge - Monthly Series",
//     location: "Online - Dimana Saja",
//     date: "Setiap Bulan",
//     participants: "5.2k",
//     price: 75000,
//     type: "virtual",
//     badge: "Trending",
//     image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
//     categories: ["Virtual", "All Levels"],
//     difficulty: "Beginner",
//     organizer: "RunVirtual Indonesia",
//     earlyBird: false
//   },
// ]

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false
  })
  const [error, setError] = useState(null)
  const limit = 9
  
  // State untuk filter yang akan dikirim ke API
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    locations: [],
    min_price: '',
    max_price: '',
    sort_by: 'event_date',
    sort_order: 'asc'
  })

  // Ref untuk debounce timeout
  const debounceTimeout = useRef(null)

  const loadEvents = useCallback(async (page = 1, append = false, filterParams = {}) => {
    try {
      if (page === 1) {
        setLoading(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status: 'active',
        ...filterParams
      })

      // Add array parameters
      if (filterParams.categories && filterParams.categories.length > 0) {
        params.append('categories', filterParams.categories.join(','))
      }
      if (filterParams.locations && filterParams.locations.length > 0) {
        params.append('locations', filterParams.locations.join(','))
      }

      const response = await fetch(`/api/events?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }

      const result = await response.json()

      if (result.success) {
        if (append) {
          setEvents(prev => [...prev, ...result.data.items])
        } else {
          setEvents(result.data.items)
        }

        setPagination({
          currentPage: result.data.pagination.current_page,
          totalPages: result.data.pagination.total_pages,
          totalItems: result.data.pagination.total_items,
          hasNextPage: result.data.pagination.has_next_page
        })
      }
    } catch (err) {
      console.error('Error loading events:', err)
      setError('Gagal memuat data event. Silakan coba lagi.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [limit])

  // Fungsi untuk debounce API call
  const debouncedLoadEvents = useCallback((newFilters) => {
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set new timeout untuk delay 500ms
    debounceTimeout.current = setTimeout(() => {
      loadEvents(1, false, newFilters)
    }, 750)
  }, [loadEvents])

  // Handle filter change dengan debounce untuk search dan price
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }))

    // Check jika yang berubah adalah search atau price range
    const isSearchOrPriceChange = 
      'search' in newFilters || 
      'min_price' in newFilters || 
      'max_price' in newFilters

    if (isSearchOrPriceChange) {
      // Gunakan debounce untuk search dan price range
      debouncedLoadEvents(updatedFilters)
    } else {
      // Untuk filter lain (categories, locations, sort), langsung panggil API
      loadEvents(1, false, updatedFilters)
    }
  }

  // Initial load
  useEffect(() => {
    loadEvents(1, false, filters)

    // Cleanup debounce timeout on unmount
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loadingMore) {
      loadEvents(pagination.currentPage + 1, true, filters)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br bg-primary via-primary to-white">
          {/* Background Gradient */}
          <div className="h-96 bg-cover bg-center" >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 mt-16">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
                  Temukan Event Lari Terbaik
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Jelajahi berbagai event lari dari seluruh Indonesia. Dari marathon hingga fun run,
                  temukan yang sesuai dengan level dan preferensimu.
                </p>
              </div>
            </div>
          </div>
        </div>
        <EventList
          events={events}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          pagination={pagination}
          onLoadMore={handleLoadMore}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </Layout>
  )
}