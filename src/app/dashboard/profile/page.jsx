'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@iconify/react'
import { updateUserData } from '@/lib/auth-storage'

export default function ProfilePage() {
  const { user, token } = useAuth()

  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'password'
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    avatar_url: ''
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        avatar_url: user.avatar_url || ''
      })
    }
  }, [user])

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update profile API call
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/members/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          avatar_url: formData.avatar_url
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })

        // Update user data in local storage
        updateUserData(data.data.user)

        // Refresh page to show updated data
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1500)
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Gagal mengupdate profil'
        })
      }
    } catch (error) {
      console.error('Update profile error:', error)
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update password API call
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({
        type: 'error',
        text: 'Password baru dan konfirmasi password tidak cocok'
      })
      setIsLoading(false)
      return
    }

    // Validate password strength (optional)
    if (passwordData.new_password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password minimal 8 karakter'
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/members/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })

        // Clear password fields
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Gagal mengubah password'
        })
      }
    } catch (error) {
      console.error('Update password error:', error)
      setMessage({
        type: 'error',
        text: 'Terjadi kesalahan. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">
            Kelola informasi profil Anda dan amankan akun dengan password yang kuat
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'profile'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon icon="mdi:account" className="w-5 h-5 inline-block mr-2" />
              Informasi Profil
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === 'password'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon icon="mdi:lock" className="w-5 h-5 inline-block mr-2" />
              Ubah Password
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            <div className="flex items-center">
              <Icon
                icon={message.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'}
                className="w-5 h-5 mr-2"
              />
              {message.text}
            </div>
          </div>
        )}

        {/* Profile Form */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar Preview & Upload */}
              {/* <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow">
                    {formData.avatar_url ? (
                      <img
                        src={formData.avatar_url}
                        alt={formData.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary">
                        <span className="text-white text-2xl font-bold">
                          {formData.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Masukkan URL gambar untuk avatar:', formData.avatar_url)
                      if (url !== null) {
                        setFormData(prev => ({ ...prev, avatar_url: url }))
                      }
                    }}
                    className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  >
                    <Icon icon="mdi:camera" className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload foto profil Anda. Format yang didukung: JPG, PNG, GIF. Ukuran maksimum: 2MB.
                    Anda juga bisa menggunakan URL gambar dari internet.
                  </p>
                </div>
              </div> */}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    required
                    placeholder="email@contoh.com"
                    disabled={true}
                  />
                  {/* <p className="mt-1 text-sm text-gray-500">
                    {user.is_email_verified ? (
                      <span className="text-green-600 flex items-center">
                        <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                        Email terverifikasi
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                        Email belum diverifikasi
                      </span>
                    )}
                  </p> */}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <Input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleProfileChange}
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <Input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleProfileChange}
                    placeholder="081234567890"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <Input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleProfileChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div> */}
              </div>

              {/* Account Info (Readonly) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Informasi Akun <span className="ml-1 bg-gray-400 py-1 px-2 text-xs rounded-full font-medium text-gray-100 capitalize">{user.role}</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Terdaftar Sejak</p>
                    <p className="font-medium text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Login Terakhir</p>
                    <p className="font-medium text-gray-900">
                      {user.last_login ? (
                        new Date(user.last_login).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ) : (
                        'Belum pernah login'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Reset form to original user data
                    setFormData({
                      full_name: user.full_name || '',
                      email: user.email || '',
                      phone_number: user.phone_number || '',
                      avatar_url: user.avatar_url || ''
                    })
                    setMessage({ type: '', text: '' })
                  }}
                  disabled={isLoading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon icon="mdi:loading" className="w-5 h-5 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Password Form */}
        {activeTab === 'password' && (
          <div className="max-w-lg">
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Saat Ini *
                  </label>
                  <Input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru *
                  </label>
                  <Input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Masukkan password baru"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Password minimal 8 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru *
                  </label>
                  <Input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Konfirmasi password baru"
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  <Icon icon="mdi:information" className="w-4 h-4 inline-block mr-1" />
                  Tips Password yang Aman:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <Icon icon="mdi:check" className="w-4 h-4 mr-2 text-green-600" />
                    Minimal 8 karakter
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check" className="w-4 h-4 mr-2 text-green-600" />
                    Kombinasi huruf besar dan kecil
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check" className="w-4 h-4 mr-2 text-green-600" />
                    Gunakan angka dan simbol
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check" className="w-4 h-4 mr-2 text-green-600" />
                    Hindari password yang mudah ditebak
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      confirm_password: ''
                    })
                    setMessage({ type: '', text: '' })
                  }}
                  disabled={isLoading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon icon="mdi:loading" className="w-5 h-5 mr-2 animate-spin" />
                      Mengubah...
                    </>
                  ) : (
                    'Ubah Password'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}