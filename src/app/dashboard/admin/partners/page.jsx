'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
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
      setPagination(prev => ({ ...prev, current_page: 1 })) // Reset to page 1 on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch partners
  useEffect(() => {
    fetchPartners()
  }, [debouncedSearch, statusFilter, pagination.current_page])

  const fetchPartners = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: pagination.per_page,
        status: statusFilter
      })

      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }

      const response = await fetch(`/api/partners?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Gagal mengambil data partner')
      }

      const result = await response.json()

      if (result.success) {
        setPartners(result.data.items || [])
        setPagination(result.data.pagination || pagination)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching partners:', err)
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, current_page: newPage }))
    }
  }

  const handleToggleStatus = async (partnerId, currentStatus) => {
    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchPartners()
      } else {
        alert(result.message || 'Gagal mengubah status')
      }
    } catch (error) {
      console.error('Error toggling partner status:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handleDelete = async (partnerId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus partner ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchPartners()
      } else {
        alert(result.message || 'Gagal menghapus partner')
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Partner</h1>
            <p className="text-gray-600 mt-1">Kelola semua partner yang bekerja sama dengan RUNminders</p>
          </div>
          <Link href="/dashboard/admin/partners/create">
            <Button variant="primary" size="md">
              <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
              Tambah Partner Baru
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="text"
                  placeholder="Cari partner..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['active', 'inactive', 'all'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {status === 'active' && 'Aktif'}
                  {status === 'inactive' && 'Nonaktif'}
                  {status === 'all' && 'Semua'}
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
              <p className="mt-4 text-gray-600">Memuat data partner...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto" />
              <p className="mt-4 text-gray-600">{error}</p>
              <button
                onClick={fetchPartners}
                className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
              >
                <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
                Coba Lagi
              </button>
            </div>
          ) : partners.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:account-group-outline" className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">Belum ada partner yang terdaftar</p>
              <Link href="/dashboard/admin/partners/create">
                <Button variant="primary" size="sm" className="mt-4">
                  <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
                  Tambah Partner Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Logo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Partner</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Website</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact Person</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal Dibuat</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {partner.logo_url ? (
                              <img
                                src={partner.logo_url}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.parentElement.innerHTML = `
                                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                    ${partner.name.charAt(0)}
                                  </div>
                                `
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                {partner.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{partner.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 hover:underline flex items-center"
                            >
                              <Icon icon="mdi:link" className="w-4 h-4 mr-1" />
                              <span className="truncate max-w-[150px]">{partner.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{partner.contact_person || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{formatDate(partner.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(partner.id, partner.is_active)}
                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${partner.is_active
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {partner.is_active ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/admin/partners/${partner.id}`}
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Icon icon="mdi:pencil" className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(partner.id)}
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

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Menampilkan {partners.length} dari {pagination.total_items} partner
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Partner</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total_items}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon icon="mdi:handshake" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partner Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {partners.filter(p => p.is_active).length}
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
                <p className="text-sm text-gray-600">Partner Nonaktif</p>
                <p className="text-2xl font-bold text-gray-600">
                  {partners.filter(p => !p.is_active).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Icon icon="mdi:close-circle" className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dengan Website</p>
                <p className="text-2xl font-bold text-blue-600">
                  {partners.filter(p => p.website).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon icon="mdi:web" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}