'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function PartnerFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const isEditMode = id && id !== 'create'

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo_url: '',
    contact_person: ''
  })
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditMode)
  const [errors, setErrors] = useState({})
  const [apiResponse, setApiResponse] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  // Fetch data jika edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchPartnerDetail()
    }
  }, [id])

  const fetchPartnerDetail = async () => {
    try {
      setIsFetching(true)
      setErrors({})

      const response = await fetch(`/api/partners/${id}`)

      if (!response.ok) {
        throw new Error('Gagal mengambil data partner')
      }

      const result = await response.json()

      if (result.success) {
        const partner = result.data
        setFormData({
          name: partner.name || '',
          website: partner.website || '',
          logo_url: partner.logo_url || '',
          contact_person: partner.contact_person || ''
        })
        setIsActive(partner.is_active)
        setLogoPreview(partner.logo_url)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching partner:', err)
      setApiResponse({
        success: false,
        message: err.message
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error untuk field yang diubah
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Clear API response
    if (apiResponse) {
      setApiResponse(null)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama partner harus diisi'
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Format URL tidak valid'
    }

    if (formData.logo_url && !isValidUrl(formData.logo_url)) {
      newErrors.logo_url = 'Format URL tidak valid'
    }

    return newErrors
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleLogoUrlChange = (e) => {
    const url = e.target.value
    handleChange(e)

    // Update preview jika URL valid
    if (url && isValidUrl(url)) {
      setLogoPreview(url)
    } else {
      setLogoPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsLoading(true)
    setApiResponse(null)

    try {
      const url = isEditMode ? `/api/partners/${id}` : '/api/partners'
      const method = isEditMode ? 'PUT' : 'POST'

      const payload = {
        name: formData.name.trim(),
        website: formData.website.trim() || null,
        logo_url: formData.logo_url.trim() || null,
        contact_person: formData.contact_person.trim() || null
      }

      // Tambahkan is_active hanya untuk edit mode
      if (isEditMode) {
        payload.is_active = isActive
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        // Redirect ke list partners setelah sukses
        setTimeout(() => {
          router.push('/dashboard/admin/partners')
          router.refresh()
        }, 1500)

        setApiResponse({
          success: true,
          message: isEditMode ? 'Partner berhasil diperbarui!' : 'Partner berhasil ditambahkan!'
        })
      } else {
        setApiResponse({
          success: false,
          message: result.message || 'Terjadi kesalahan'
        })
      }
    } catch (error) {
      console.error('Error saving partner:', error)
      setApiResponse({
        success: false,
        message: 'Terjadi kesalahan jaringan. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/admin/partners')
  }

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data partner...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Partner' : 'Tambah Partner Baru'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Perbarui informasi partner yang sudah ada'
                : 'Tambahkan partner baru untuk bekerja sama dengan RUNminders'}
            </p>
          </div>
          <Link
            href="/dashboard/admin/partners"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-1" />
            Kembali
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Response Notification */}
          {apiResponse && (
            <div className={`p-4 rounded-lg ${apiResponse.success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {apiResponse.success ? (
                    <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
                  ) : (
                    <Icon icon="mdi:close-circle" className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${apiResponse.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {apiResponse.message}
                  </p>
                  {apiResponse.success && (
                    <p className="text-sm text-green-700 mt-1">
                      Mengalihkan ke halaman partner...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="bg-white space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Partner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: OpenAI, Nike, Adidas"
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 border ${errors.website ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Masukkan URL lengkap dengan http:// atau https://
              </p>
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
                URL Logo
              </label>
              <input
                type="url"
                id="logo_url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleLogoUrlChange}
                placeholder="https://example.com/logo.svg"
                className={`w-full px-4 py-3 border ${errors.logo_url ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
              />
              {errors.logo_url && (
                <p className="mt-1 text-sm text-red-600">{errors.logo_url}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                URL gambar logo partner (opsional)
              </p>

              {/* Logo Preview */}
              {logoPreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview Logo:</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center p-2">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                        onError={() => setLogoPreview(null)}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {formData.name || 'Nama Partner'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Logo akan ditampilkan di halaman partner
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Nama PIC atau '-' jika tidak ada"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nama person yang bisa dihubungi (opsional)
              </p>
            </div>

            {/* Status Active (Hanya untuk Edit Mode) */}
            {isEditMode && (
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-300'
                      }`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status Aktif</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isActive
                        ? 'Partner akan ditampilkan di halaman publik'
                        : 'Partner tidak akan ditampilkan di halaman publik'}
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Created/Updated Info (Hanya untuk Edit Mode) */}
            {isEditMode && formData.created_at && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Dibuat:</span>{' '}
                    {new Date(formData.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {formData.updated_at && formData.updated_at !== formData.created_at && (
                    <div>
                      <span className="font-medium">Terakhir diupdate:</span>{' '}
                      {new Date(formData.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEditMode ? 'Menyimpan...' : 'Menambahkan...'}
                </>
              ) : (
                <>
                  <Icon
                    icon={isEditMode ? 'mdi:content-save' : 'mdi:plus'}
                    className="w-5 h-5 mr-2"
                  />
                  {isEditMode ? 'Simpan Perubahan' : 'Tambah Partner'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}