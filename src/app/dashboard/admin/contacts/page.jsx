'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/formatters-utils'

const STATUS_STYLES = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  read: 'bg-gray-100 text-gray-700 border-gray-200',
  replied: 'bg-green-100 text-green-800 border-green-200'
}

const STATUS_LABELS = {
  new: 'Baru',
  read: 'Dibaca',
  replied: 'Dibalas'
}

export default function AdminContactsPage() {
  const { user, token, isLoading: authLoading } = useAuth()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
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
    if (!authLoading && user?.role === 'admin') {
      fetchMessages()
    }
  }, [debouncedSearch, statusFilter, pagination.current_page, authLoading, user])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: pagination.per_page,
        status: statusFilter
      })
      if (debouncedSearch) params.append('search', debouncedSearch)

      const response = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await response.json()

      if (result.success) {
        setMessages(result.data.items || [])
        setPagination(result.data.pagination || pagination)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesan ini secara permanen?')) return

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await response.json()

      if (result.success) {
        fetchMessages()
      } else {
        alert(result.message || 'Gagal menghapus pesan')
      }
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, current_page: newPage }))
    }
  }

  // Redirect jika bukan admin
  if (!authLoading && user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Icon icon="mdi:lock-outline" className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Akses Ditolak</h2>
          <p className="text-gray-500">Halaman ini hanya dapat diakses oleh admin.</p>
        </div>
      </DashboardLayout>
    )
  }

  const countByStatus = (status) => messages.filter(m => m.status === status).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
          <p className="text-gray-600 mt-1">Kelola pesan dari form kontak publik</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pesan', value: pagination.total_items, icon: 'mdi:email-outline', color: 'text-gray-700', bg: 'bg-gray-100' },
            { label: 'Belum Dibaca', value: countByStatus('new'), icon: 'mdi:email-alert-outline', color: 'text-blue-700', bg: 'bg-blue-100' },
            { label: 'Sudah Dibaca', value: countByStatus('read'), icon: 'mdi:email-open-outline', color: 'text-gray-600', bg: 'bg-gray-100' },
            { label: 'Sudah Dibalas', value: countByStatus('replied'), icon: 'mdi:email-check-outline', color: 'text-green-700', bg: 'bg-green-100' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau subjek..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-0"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'new', 'read', 'replied'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s)
                    setPagination(prev => ({ ...prev, current_page: 1 }))
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${statusFilter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {s === 'all' ? 'Semua' : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Memuat pesan...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto" />
              <p className="mt-4 text-gray-600">{error}</p>
              <button onClick={fetchMessages} className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto gap-2">
                <Icon icon="mdi:refresh" className="w-5 h-5" />
                Coba Lagi
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:email-outline" className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-4 text-gray-500">Belum ada pesan masuk</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pengirim</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subjek</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {messages.map((msg) => (
                      <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${msg.status === 'new' ? 'font-medium' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{msg.name}</div>
                          <div className="text-sm text-gray-500">{msg.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 line-clamp-1">{msg.subject}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[msg.status]}`}>
                            {STATUS_LABELS[msg.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(msg.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/admin/contacts/${msg.id}`}
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Lihat detail"
                            >
                              <Icon icon="mdi:eye-outline" className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                            </button>
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
                    Menampilkan {messages.length} dari {pagination.total_items} pesan
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={!pagination.has_previous_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${pagination.has_previous_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                    >
                      <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Halaman {pagination.current_page} dari {pagination.total_pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={!pagination.has_next_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${pagination.has_next_page ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
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
