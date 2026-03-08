'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export default function MyEventsPage() {
  const { user, token } = useAuth()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 1,
    has_next_page: false,
    has_previous_page: false
  })
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  })

  // Fetch events data
  const fetchEvents = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/my-events?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setEvents(data.data.items || [])
        setPagination(data.data.pagination || {
          current_page: 1,
          per_page: 10,
          total_items: 0,
          total_pages: 1,
          has_next_page: false,
          has_previous_page: false
        })
      } else {
        console.error('Failed to fetch events:', data.message)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token, filters])

  // Initial fetch and on filter change
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }))
  }

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Get payment status badge style
  const getPaymentStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Get location type badge
  const getLocationTypeBadge = (type) => {
    return type === 'virtual' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200'
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Saya</h1>
          <p className="text-gray-600">
            Kelola dan pantau semua event yang telah Anda daftar
          </p>
        </div>

        {/* Stats Summary */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                <Icon icon="mdi:ticket" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Event</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total_items}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mr-4">
                <Icon icon="mdi:calendar-check" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Event Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.registration.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mr-4">
                <Icon icon="mdi:cash" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Belanja</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(events.reduce((sum, event) => sum + (event.category?.price || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Filters */}
        {/* <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"> */}
        <div className="bg-white mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Event
              </label>
              <Input
                type="text"
                placeholder="Cari berdasarkan nama event atau kode registrasi..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-primary focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-colors duration-200"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Konfirmasi</option>
                <option value="confirmed">Terkonfirmasi</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            <div>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    status: 'all',
                    search: '',
                    page: 1,
                    limit: 10
                  })
                }}
              >
                <Icon icon="mdi:filter-remove" className="w-5 h-5 mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Loading State */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data event...</p>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {events.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon icon="mdi:calendar-remove" className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum ada event
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filters.search || filters.status !== 'all' 
                      ? 'Tidak ditemukan event dengan filter yang dipilih' 
                      : 'Anda belum mendaftar event apapun. Yuk, daftar event sekarang!'}
                  </p>
                  {(!filters.search && filters.status === 'all') && (
                    <Link href="/events">
                      <Button>
                        <Icon icon="mdi:run" className="w-5 h-5 mr-2" />
                        Cari Event
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tanggal
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kategori
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pembayaran
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                            {/* Event Info */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden">
                                  <img
                                    className="h-16 w-16 object-cover"
                                    src={event.image_url || '/images/event-default.jpg'}
                                    alt={event.title}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {event.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {event.subtitle}
                                  </div>
                                  <div className="mt-1 flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getLocationTypeBadge(event.location_type)}`}>
                                      <Icon icon={event.location_type === 'virtual' ? 'mdi:monitor' : 'mdi:map-marker'} className="w-3 h-3 mr-1" />
                                      {event.location_type === 'virtual' ? 'Online' : 'Offline'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {event.registration.registration_number}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(event.event_date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {event.location}
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {event.category?.name || '-'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {event.category?.distance || '-'}
                              </div>
                              <div className="text-sm font-medium text-primary">
                                {event.is_free ? 'Gratis' : formatCurrency(event.category?.price || 0)}
                              </div>
                            </td>

                            {/* Registration Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(event.registration.status)}`}>
                                <Icon 
                                  icon={
                                    event.registration.status === 'confirmed' ? 'mdi:check-circle' :
                                    event.registration.status === 'pending' ? 'mdi:clock' :
                                    event.registration.status === 'cancelled' ? 'mdi:close-circle' : 'mdi:help-circle'
                                  } 
                                  className="w-4 h-4 mr-1.5" 
                                />
                                {event.registration.status === 'confirmed' ? 'Terkonfirmasi' :
                                 event.registration.status === 'pending' ? 'Menunggu' :
                                 event.registration.status === 'cancelled' ? 'Dibatalkan' : event.registration.status}
                              </span>
                              <div className="mt-1 text-xs text-gray-500">
                                Daftar: {new Date(event.registration.created_at).toLocaleDateString('id-ID')}
                              </div>
                            </td>

                            {/* Payment Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusBadge(event.registration.payment_status)}`}>
                                <Icon 
                                  icon={
                                    event.registration.payment_status === 'paid' ? 'mdi:check-circle' :
                                    event.registration.payment_status === 'pending' ? 'mdi:clock' :
                                    event.registration.payment_status === 'failed' ? 'mdi:close-circle' : 'mdi:help-circle'
                                  } 
                                  className="w-4 h-4 mr-1.5" 
                                />
                                {event.registration.payment_status === 'paid' ? 'Lunas' :
                                 event.registration.payment_status === 'pending' ? 'Menunggu' :
                                 event.registration.payment_status === 'failed' ? 'Gagal' : event.registration.payment_status}
                              </span>
                              {!event.is_free && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {formatCurrency(event.category?.price || 0)}
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link href={`/events/${event.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Icon icon="mdi:eye" className="w-4 h-4" />
                                  </Button>
                                </Link>
                                
                                {event.registration.payment_status === 'pending' && (
                                  <Button size="sm" variant="primary">
                                    <Icon icon="mdi:credit-card" className="w-4 h-4" />
                                  </Button>
                                )}

                                {event.registration.status === 'confirmed' && (
                                  <Button size="sm" variant="outline">
                                    <Icon icon="mdi:download" className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="mt-2">
                                <Link href={`/dashboard/my-events/${event.registration.id}`}>
                                  <span className="text-primary hover:text-primary-dark text-sm cursor-pointer flex items-center">
                                    <Icon icon="mdi:information" className="w-4 h-4 mr-1" />
                                    Detail
                                  </span>
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
                    <div className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Menampilkan{' '}
                          <span className="font-medium">
                            {((pagination.current_page - 1) * pagination.per_page) + 1}
                          </span>{' '}
                          -{' '}
                          <span className="font-medium">
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)}
                          </span>{' '}
                          dari{' '}
                          <span className="font-medium">{pagination.total_items}</span>{' '}
                          event
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={!pagination.has_previous_page || isLoading}
                          >
                            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                          </Button>

                          {[...Array(pagination.total_pages)].map((_, i) => (
                            <Button
                              key={i + 1}
                              size="sm"
                              variant={pagination.current_page === i + 1 ? "primary" : "outline"}
                              onClick={() => handlePageChange(i + 1)}
                              disabled={isLoading}
                            >
                              {i + 1}
                            </Button>
                          ))}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={!pagination.has_next_page || isLoading}
                          >
                            <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}