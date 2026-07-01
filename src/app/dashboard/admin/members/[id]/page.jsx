'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

export default function MemberDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const { user, token, isLoading: authLoading } = useAuth()
  
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  // Fetch member detail
  useEffect(() => {
    if (!authLoading && user?.role === 'admin' && id) {
      fetchMemberDetail()
    }
  }, [id, authLoading, user])

  const fetchMemberDetail = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')

      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/admin/members/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login')
          return
        }
        if (response.status === 404) {
          throw new Error('Member tidak ditemukan')
        }
        throw new Error('Gagal mengambil data member')
      }

      const result = await response.json()

      if (result.success) {
        setMember(result.data)
        setEditForm({
          full_name: result.data.full_name || '',
          phone_number: result.data.phone_number || '',
          is_active: result.data.is_active,
          role: result.data.role,
          is_email_verified: result.data.is_email_verified
        })
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching member detail:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = async () => {
    try {
      // const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: editForm.is_active,
          role: editForm.role,
          is_email_verified: editForm.is_email_verified,
          full_name: editForm.full_name,
          phone_number: editForm.phone_number
        })
      })

      const result = await response.json()

      if (result.success) {
        setMember({
          ...member,
          ...editForm
        })
        setIsEditing(false)
        alert('Data member berhasil diupdate')
      } else {
        alert(result.message || 'Gagal mengupdate data')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data member...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !member) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'Member tidak ditemukan'}</p>
            <button
              onClick={() => router.push('/dashboard/admin/members')}
              className="mt-4 text-primary hover:text-primary/80 font-medium"
            >
              ← Kembali ke Daftar Member
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard/admin/members')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Member</h1>
              <p className="text-gray-600 mt-1">Informasi lengkap member ID: {member.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsEditing(true)}
              >
                <Icon icon="mdi:pencil" className="w-5 h-5 mr-2" />
                Edit Member
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsEditing(false)
                    setEditForm({
                      full_name: member.full_name || '',
                      phone_number: member.phone_number || '',
                      is_active: member.is_active,
                      role: member.role,
                      is_email_verified: member.is_email_verified
                    })
                  }}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveChanges}
                >
                  <Icon icon="mdi:content-save" className="w-5 h-5 mr-2" />
                  Simpan Perubahan
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl">
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
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
                member.is_active ? 'bg-green-500' : 'bg-gray-400'
              }`} title={member.is_active ? 'Aktif' : 'Nonaktif'} />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{member.full_name || 'Belum mengisi nama'}</h2>
              <p className="text-gray-600">{member.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <Icon icon={member.role === 'admin' ? 'mdi:shield-account' : 'mdi:account'} className="w-3 h-3 inline mr-1" />
                  {member.role === 'admin' ? 'Administrator' : 'Member'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.is_email_verified
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <Icon icon={member.is_email_verified ? 'mdi:email-check' : 'mdi:email-alert'} className="w-3 h-3 inline mr-1" />
                  {member.is_email_verified ? 'Email Terverifikasi' : 'Email Belum Verifikasi'}
                </span>
                {member.provider && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    <Icon icon={member.provider === 'google' ? 'mdi:google' : 'mdi:github'} className="w-3 h-3 inline mr-1" />
                    {member.provider}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{member.account_age_days}</p>
                <p className="text-xs text-gray-500">Hari Bergabung</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {member.days_since_last_login !== null ? member.days_since_last_login : '-'}
                </p>
                <p className="text-xs text-gray-500">Hari sejak login</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{member.failed_login_attempts || 0}</p>
                <p className="text-xs text-gray-500">Login Gagal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon icon="mdi:account" className="w-4 h-4 inline mr-2" />
              Profil
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activity'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon icon="mdi:history" className="w-4 h-4 inline mr-2" />
              Aktivitas
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'events'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon icon="mdi:ticket" className="w-4 h-4 inline mr-2" />
              Event Terdaftar
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon icon="mdi:security" className="w-4 h-4 inline mr-2" />
              Keamanan
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Informasi Profil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  // Edit Mode
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) => handleEditChange('full_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                      <input
                        type="text"
                        value={editForm.phone_number}
                        onChange={(e) => handleEditChange('phone_number', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+628123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => handleEditChange('role', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.is_active}
                            onChange={(e) => handleEditChange('is_active', e.target.checked)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary mr-2"
                          />
                          <span className="text-sm text-gray-700">Akun Aktif</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.is_email_verified}
                            onChange={(e) => handleEditChange('is_email_verified', e.target.checked)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary mr-2"
                          />
                          <span className="text-sm text-gray-700">Email Terverifikasi</span>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <InfoItem label="Nama Lengkap" value={member.full_name || '-'} />
                    <InfoItem label="Email" value={member.email} />
                    <InfoItem label="Nomor Telepon" value={member.phone_number || '-'} />
                    <InfoItem label="Role" value={member.role === 'admin' ? 'Administrator' : 'Member'} />
                    <InfoItem label="Status Akun" value={member.is_active ? 'Aktif' : 'Nonaktif'} />
                    <InfoItem label="Verifikasi Email" value={member.is_email_verified ? 'Terverifikasi' : 'Belum Verifikasi'} />
                    <InfoItem label="Provider" value={member.provider || 'Email & Password'} />
                    <InfoItem label="Avatar URL" value={member.avatar_url || '-'} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Riwayat Aktivitas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Tanggal Bergabung" value={formatDate(member.created_at)} />
                <InfoItem label="Terakhir Update" value={formatDate(member.updated_at)} />
                <InfoItem label="Terakhir Login" value={member.last_login_at ? formatDate(member.last_login_at) : '-'} />
                <InfoItem label="Email Diverifikasi Pada" value={member.email_verified_at ? formatDate(member.email_verified_at) : '-'} />
                <InfoItem label="Umur Akun" value={`${member.account_age_days} hari`} />
                <InfoItem label="Hari Sejak Login" value={member.days_since_last_login !== null ? `${member.days_since_last_login} hari` : '-'} />
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Timeline</h4>
                <div className="space-y-4">
                  <TimelineItem
                    icon="mdi:account-plus"
                    title="Akun dibuat"
                    time={member.created_at}
                    active
                  />
                  {member.email_verified_at && (
                    <TimelineItem
                      icon="mdi:email-check"
                      title="Email diverifikasi"
                      time={member.email_verified_at}
                      active
                    />
                  )}
                  {member.last_login_at && (
                    <TimelineItem
                      icon="mdi:login"
                      title="Login terakhir"
                      time={member.last_login_at}
                      active
                    />
                  )}
                  {member.updated_at !== member.created_at && (
                    <TimelineItem
                      icon="mdi:pencil"
                      title="Profil diupdate"
                      time={member.updated_at}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Event Terdaftar</h3>
              
              <div className="text-center py-12 text-gray-500">
                <Icon icon="mdi:ticket-outline" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Belum ada event yang didaftarkan oleh member ini</p>
                <p className="text-sm mt-2">Fitur akan segera hadir</p>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Informasi Keamanan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Jumlah Login Gagal" value={member.failed_login_attempts || '0'} />
                <InfoItem label="2FA Status" value="Not Enabled" />
                <InfoItem label="Password Terakhir Diubah" value="-" />
                <InfoItem label="Sesi Aktif" value="-" />
              </div>

              {/* Danger Zone */}
              <div className="mt-8 p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                  <Icon icon="mdi:alert" className="w-5 h-5 mr-2" />
                  Danger Zone
                </h4>
                <p className="text-sm text-red-600 mb-4">
                  Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    onClick={() => {
                      if (confirm('Reset password member ini? Mereka akan menerima email untuk membuat password baru.')) {
                        alert('Fitur reset password akan segera hadir')
                      }
                    }}
                  >
                    Reset Password
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin menonaktifkan akun ini?')) {
                        handleEditChange('is_active', false)
                        handleSaveChanges()
                      }
                    }}
                  >
                    Nonaktifkan Akun
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper Components
function InfoItem({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium break-all">{value}</p>
    </div>
  )
}

function TimelineItem({ icon, title, time, active = false }) {
  const formattedTime = new Date(time).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-full ${active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
        <Icon icon={icon} className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{formattedTime}</p>
      </div>
    </div>
  )
}