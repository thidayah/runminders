'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

export default function AdminMembersPage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
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

  // Fetch members
  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchMembers()
    }
  }, [debouncedSearch, statusFilter, roleFilter, verifiedFilter, sortBy, sortOrder, pagination.current_page, authLoading, user])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!token) {
        router.push('/login')
        return
      }

      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: pagination.per_page,
        sort_by: sortBy,
        sort_order: sortOrder
      })

      // Status filter
      if (statusFilter !== 'all') {
        params.append('is_active', statusFilter === 'active' ? 'true' : 'false')
      }

      // Role filter
      if (roleFilter !== 'all') {
        params.append('role', roleFilter)
      }

      // Verified filter
      if (verifiedFilter !== 'all') {
        params.append('is_email_verified', verifiedFilter === 'verified' ? 'true' : 'false')
      }

      // Search
      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }

      const response = await fetch(`/api/admin/members?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        throw new Error('Gagal mengambil data member')
      }

      const result = await response.json()

      if (result.success) {
        setMembers(result.data.items || [])
        setPagination(result.data.pagination || pagination)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching members:', err)
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

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role)
    setPagination(prev => ({ ...prev, current_page: 1 }))
  }

  const handleVerifiedChange = (verified) => {
    setVerifiedFilter(verified)
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleToggleStatus = async (memberId, currentStatus) => {
    try {      
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchMembers()
      } else {
        alert(result.message || 'Gagal mengubah status')
      }
    } catch (error) {
      console.error('Error toggling member status:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handleToggleVerified = async (memberId, currentVerified) => {
    try {      
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_email_verified: !currentVerified })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchMembers()
      } else {
        alert(result.message || 'Gagal mengubah status verifikasi')
      }
    } catch (error) {
      console.error('Error toggling verified status:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const handleRoleChange = async (memberId, newRole) => {
    try {      
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh list
        fetchMembers()
      } else {
        alert(result.message || 'Gagal mengubah role')
      }
    } catch (error) {
      console.error('Error changing member role:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  // Loading state saat cek auth
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Redirect jika bukan admin
  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon icon="mdi:shield-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Member</h1>
            <p className="text-gray-600 mt-1">Kelola semua member yang terdaftar di platform</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setRoleFilter('all')
                setVerifiedFilter('all')
                setSortBy('created_at')
                setSortOrder('desc')
                setPagination(prev => ({ ...prev, current_page: 1 }))
              }}
            >
              <Icon icon="mdi:refresh" className="w-4 h-4 mr-1" />
              Reset Filter
            </Button>
          </div>
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
              placeholder="Cari member berdasarkan email, nama, atau nomor telepon..."
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
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
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

            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <div className="flex gap-2">
                {['all', 'member', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleFilterChange(role)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      roleFilter === role
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {role === 'all' && 'Semua'}
                    {role === 'member' && 'Member'}
                    {role === 'admin' && 'Admin'}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Verifikasi:</span>
              <div className="flex gap-2">
                {['all', 'verified', 'unverified'].map((verified) => (
                  <button
                    key={verified}
                    onClick={() => handleVerifiedChange(verified)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      verifiedFilter === verified
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {verified === 'all' && 'Semua'}
                    {verified === 'verified' && 'Terverifikasi'}
                    {verified === 'unverified' && 'Belum Verifikasi'}
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
              <p className="mt-4 text-gray-600">Memuat data member...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto" />
              <p className="mt-4 text-gray-600">{error}</p>
              <button
                onClick={fetchMembers}
                className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
              >
                <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
                Coba Lagi
              </button>
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center">
              <Icon icon="mdi:account-group-outline" className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">Belum ada member yang terdaftar</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Member</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('email')}>
                        <div className="flex items-center">
                          Email
                          {sortBy === 'email' && (
                            <Icon icon={sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'} className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kontak</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('role')}>
                        <div className="flex items-center">
                          Role
                          {sortBy === 'role' && (
                            <Icon icon={sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'} className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('created_at')}>
                        <div className="flex items-center">
                          Bergabung
                          {sortBy === 'created_at' && (
                            <Icon icon={sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'} className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer" onClick={() => handleSort('last_login_at')}>
                        <div className="flex items-center">
                          Terakhir Login
                          {sortBy === 'last_login_at' && (
                            <Icon icon={sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'} className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {member.avatar_url ? (
                                <img
                                  src={member.avatar_url}
                                  alt={member.full_name}
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.parentElement.innerHTML = getInitials(member.full_name)
                                  }}
                                />
                              ) : (
                                getInitials(member.full_name)
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.full_name || '-'}</p>
                              <p className="text-xs text-gray-500">ID: {member.id.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{member.email}</div>
                          {member.provider && (
                            <div className="flex items-center mt-1">
                              <Icon 
                                icon={member.provider === 'google' ? 'mdi:google' : 'mdi:github'} 
                                className="w-3 h-3 text-gray-400 mr-1"
                              />
                              <span className="text-xs text-gray-500">{member.provider}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{member.phone_number || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent cursor-pointer"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <button
                              onClick={() => handleToggleStatus(member.id, member.is_active)}
                              className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors w-20 ${
                                member.is_active
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {member.is_active ? 'Aktif' : 'Nonaktif'}
                            </button>
                            <button
                              onClick={() => handleToggleVerified(member.id, member.is_email_verified)}
                              className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors w-20 ml-2 ${
                                member.is_email_verified
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              {member.is_email_verified ? 'Verified' : 'Unverified'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {formatDate(member.created_at)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {member.account_age_days} hari
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {member.last_login_at ? formatDate(member.last_login_at) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/admin/members/${member.id}`}
                              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Detail"
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
                    Menampilkan {members.length} dari {pagination.total_items} member
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={!pagination.has_previous_page}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pagination.has_previous_page
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
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pagination.has_next_page
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
                <p className="text-sm text-gray-600">Total Member</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total_items}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon icon="mdi:account-group" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {members.filter(m => m.is_active).length}
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
                <p className="text-sm text-gray-600">Terverifikasi</p>
                <p className="text-2xl font-bold text-blue-600">
                  {members.filter(m => m.is_email_verified).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon icon="mdi:email-check" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-purple-600">
                  {members.filter(m => m.role === 'admin').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Icon icon="mdi:shield-account" className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}