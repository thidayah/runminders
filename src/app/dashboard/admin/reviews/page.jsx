'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
    has_next_page: false,
    has_previous_page: false
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPagination(prev => ({ ...prev, current_page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchReviews()
  }, [debouncedSearch, statusFilter, pagination.current_page])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: pagination.per_page,
        status: statusFilter
      })
      if (debouncedSearch) params.append('search', debouncedSearch)

      const response = await fetch(`/api/reviews?${params.toString()}`)
      if (!response.ok) throw new Error('Gagal mengambil data review')

      const result = await response.json()
      if (result.success) {
        setReviews(result.data.items || [])
        setPagination(result.data.pagination || pagination)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (reviewId, currentStatus) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      })
      const result = await response.json()
      if (result.success) {
        fetchReviews()
      } else {
        alert(result.message || 'Gagal mengubah status')
      }
    } catch (error) {
      console.error('Error toggling review status:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus review ini?')) return
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        fetchReviews()
      } else {
        alert(result.message || 'Gagal menghapus review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, current_page: newPage }))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const StarDisplay = ({ rating }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          icon="mdi:star"
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Review</h1>
            <p className="text-gray-600 mt-1">Kelola testimoni yang ditampilkan di halaman beranda</p>
          </div>
          <Link href="/dashboard/admin/reviews/create">
            <Button variant="primary" size="md">
              <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
              Tambah Review Baru
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Review</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total_items}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon icon="mdi:comment-quote" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditampilkan</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.is_active).length}
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
                <p className="text-sm text-gray-600">Rating Rata-rata</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {reviews.length > 0
                    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                    : '—'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Icon icon="mdi:star" className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama, komentar, atau event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['active', 'inactive', 'all'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s)
                    setPagination(prev => ({ ...prev, current_page: 1 }))
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === s
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s === 'active' && 'Aktif'}
                  {s === 'inactive' && 'Nonaktif'}
                  {s === 'all' && 'Semua'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data review...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto" />
              <p className="mt-4 text-gray-600">{error}</p>
              <button
                onClick={fetchReviews}
                className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
              >
                <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
                Coba Lagi
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:star-outline" className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">Belum ada review yang tersimpan</p>
              <Link href="/dashboard/admin/reviews/create">
                <Button variant="primary" size="sm" className="mt-4">
                  <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
                  Tambah Review Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reviewer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Komentar</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Urutan</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-primary font-semibold text-sm">
                                {review.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{review.name}</div>
                              {review.role && (
                                <div className="text-xs text-gray-500">{review.role}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                        </td>
                        <td className="px-6 py-4">
                          <StarDisplay rating={review.rating} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{review.event_name || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{review.sort_order}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{formatDate(review.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(review.id, review.is_active)}
                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${review.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {review.is_active ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/admin/reviews/${review.id}`}
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Icon icon="mdi:pencil" className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Icon icon="mdi:delete" className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Menampilkan {reviews.length} dari {pagination.total_items} review
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={!pagination.has_previous_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${pagination.has_previous_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Halaman {pagination.current_page} dari {pagination.total_pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={!pagination.has_next_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${pagination.has_next_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
