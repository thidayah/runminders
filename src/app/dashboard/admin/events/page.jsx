'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('event_date')
  const [sortOrder, setSortOrder] = useState('asc')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
    has_next_page: false,
    has_previous_page: false
  })

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPagination(prev => ({ ...prev, current_page: 1 }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch events
  useEffect(() => {
    fetchEvents()
  }, [debouncedSearch, statusFilter, locationFilter, priceFilter, sortBy, sortOrder, pagination.current_page])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: pagination.per_page,
        sort_by: sortBy,
        sort_order: sortOrder
      })

      // Status filter
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      // Location filter
      if (locationFilter !== 'all') {
        params.append('location_type', locationFilter)
      }

      // Price filter
      if (priceFilter !== 'all') {
        params.append('is_free', priceFilter === 'free' ? 'true' : 'false')
      }

      // Search
      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }

      const response = await fetch(`/api/events?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Gagal mengambil data events')
      }

      const result = await response.json()

      if (result.success) {
        setEvents(result.data.items || [])
        setPagination(result.data.pagination || pagination)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = (status) => {
    setStatusFilter(status)
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const handleLocationChange = (location) => {
    setLocationFilter(location)
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const handlePriceChange = (price) => {
    setPriceFilter(price)
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, current_page: newPage }))
    }
  }

  const handleToggleStatus = async (eventId, currentStatus) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchEvents()
      } else {
        alert(result.message || 'Gagal mengubah status')
      }
    } catch (error) {
      console.error('Error toggling event status:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handleDelete = async (eventId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan.')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchEvents()
      } else {
        alert(result.message || 'Gagal menghapus event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (event) => {
    const now = new Date()
    const eventDate = new Date(event.event_date)
    const regClose = event.registration_close_date ? new Date(event.registration_close_date) : null

    if (!event.is_active) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Nonaktif</span>
    }

    if (eventDate < now) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">Selesai</span>
    }

    if (regClose && regClose < now) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">Pendaftaran Tutup</span>
    }

    if (event.max_participants && event.current_participants >= event.max_participants) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">Kuota Penuh</span>
    }

    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">Aktif</span>
  }

  const getLocationIcon = (type) => {
    switch (type) {
      case 'virtual':
        return <Icon icon="mdi:video" className="w-4 h-4 text-purple-500" />
      default:
        return <Icon icon="mdi:map-marker" className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Event</h1>
            <p className="text-gray-600 mt-1">Kelola semua event lari yang tersedia di platform</p>
          </div>
          <Link href="/dashboard/admin/events/create">
            <Button variant="primary" size="md">
              <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
              Buat Event Baru
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Cari event berdasarkan judul, lokasi, atau organizer..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex gap-2">
                {['all', 'active', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {status === 'all' && 'Semua'}
                    {status === 'active' && 'Aktif'}
                    {status === 'inactive' && 'Nonaktif'}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Lokasi:</span>
              <div className="flex gap-2">
                {['all', 'offline', 'virtual'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleLocationChange(type)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locationFilter === type
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {type === 'all' && 'Semua'}
                    {type === 'offline' && 'Offline'}
                    {type === 'virtual' && 'Virtual'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Harga:</span>
              <div className="flex gap-2">
                {['all', 'free', 'paid'].map((price) => (
                  <button
                    key={price}
                    onClick={() => handlePriceChange(price)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${priceFilter === price
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {price === 'all' && 'Semua'}
                    {price === 'free' && 'Gratis'}
                    {price === 'paid' && 'Berbayar'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data event...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto" />
              <p className="mt-4 text-gray-600">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
              >
                <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
                Coba Lagi
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:calendar-blank" className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">Belum ada event yang terdaftar</p>
              <Link href="/dashboard/admin/events/create">
                <Button variant="primary" size="sm" className="mt-4">
                  <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
                  Buat Event Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('event_date')}>
                        <div className="flex items-center">
                          Tanggal
                          {sortBy === 'event_date' && (
                            <Icon icon={sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'} className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kategori</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Harga</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kuota</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Organizer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dibuat</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              {event.image_url ? (
                                <img
                                  src={event.image_url}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.parentElement.innerHTML = `
                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                      ${event.title.charAt(0)}
                                    </div>
                                  `
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                  {event.title.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{event.title}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {formatDate(event.event_date)}
                            {event.event_time && (
                              <span className="text-xs text-gray-500 block">
                                {event.event_time.substring(0, 5)} WIB
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getLocationIcon(event.location_type)}
                            <span className="ml-1.5 text-sm text-gray-700 line-clamp-1">
                              {event.location || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {event.categories?.slice(0, 2).map((cat) => (
                              <span
                                key={cat.id}
                                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                              >
                                {cat.name.split(' ')[0]}
                              </span>
                            ))}
                            {event.categories?.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                +{event.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {event.is_free ? (
                            <span className="text-green-600 font-medium">Gratis</span>
                          ) : (
                            <div>
                              <span className="text-gray-900 font-medium">
                                Rp {event.base_price?.toLocaleString('id-ID')}
                              </span>
                              {event.has_early_bird && (
                                <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded text-xs">
                                  Early Bird
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{
                                  width: `${(event.current_participants / event.max_participants) * 100}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                              {event.current_participants}/{event.max_participants}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(event.id, event.is_active)}
                            className="cursor-pointer"
                          >
                            {getStatusBadge(event)}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 line-clamp-1">
                            {event.organizer_name || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {formatDateTime(event.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/admin/events/${event.id}`}
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Icon icon="mdi:pencil" className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Icon icon="mdi:delete" className="w-5 h-5" />
                            </button>
                            <Link
                              href={`/events/${event.slug}`}
                              target="_blank"
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Lihat di halaman publik"
                            >
                              <Icon icon="mdi:eye" className="w-5 h-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Menampilkan {events.length} dari {pagination.total_items} event
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={!pagination.has_previous_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${pagination.has_previous_page
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-700">
                      Halaman {pagination.current_page} dari {pagination.total_pages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={!pagination.has_next_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${pagination.has_next_page
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Event</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total_items}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon icon="mdi:calendar-star" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.is_active).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Virtual</p>
                <p className="text-2xl font-bold text-purple-600">
                  {events.filter(e => e.location_type === 'virtual').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Icon icon="mdi:video" className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gratis</p>
                <p className="text-2xl font-bold text-blue-600">
                  {events.filter(e => e.is_free).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon icon="mdi:gift" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Peserta</p>
                <p className="text-2xl font-bold text-orange-600">
                  {events.reduce((acc, e) => acc + (e.current_participants || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Icon icon="mdi:account-group" className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}