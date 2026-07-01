'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ReviewFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const isEditMode = id && id !== 'create'

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    comment: '',
    rating: 5,
    event_name: '',
    sort_order: 0
  })
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditMode)
  const [errors, setErrors] = useState({})
  const [apiResponse, setApiResponse] = useState(null)

  useEffect(() => {
    if (isEditMode) fetchReviewDetail()
  }, [id])

  const fetchReviewDetail = async () => {
    try {
      setIsFetching(true)
      const response = await fetch(`/api/reviews/${id}`)
      if (!response.ok) throw new Error('Gagal mengambil data review')
      const result = await response.json()
      if (result.success) {
        const r = result.data
        setFormData({
          name: r.name || '',
          role: r.role || '',
          comment: r.comment || '',
          rating: r.rating || 5,
          event_name: r.event_name || '',
          sort_order: r.sort_order ?? 0
        })
        setIsActive(r.is_active)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      setApiResponse({ success: false, message: err.message })
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiResponse) setApiResponse(null)
  }

  const validateForm = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Nama reviewer harus diisi'
    if (!formData.comment.trim()) errs.comment = 'Komentar harus diisi'
    if (formData.comment.trim().length < 20) errs.comment = 'Komentar minimal 20 karakter'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsLoading(true)
    setApiResponse(null)

    try {
      const url = isEditMode ? `/api/reviews/${id}` : '/api/reviews'
      const method = isEditMode ? 'PUT' : 'POST'

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        comment: formData.comment.trim(),
        rating: parseInt(formData.rating),
        event_name: formData.event_name.trim() || null,
        sort_order: parseInt(formData.sort_order) || 0
      }
      if (isEditMode) payload.is_active = isActive

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()

      if (result.success) {
        setApiResponse({
          success: true,
          message: isEditMode ? 'Review berhasil diperbarui!' : 'Review berhasil ditambahkan!'
        })
        setTimeout(() => {
          router.push('/dashboard/admin/reviews')
          router.refresh()
        }, 1500)
      } else {
        setApiResponse({ success: false, message: result.message || 'Terjadi kesalahan' })
      }
    } catch (error) {
      setApiResponse({ success: false, message: 'Terjadi kesalahan jaringan. Silakan coba lagi.' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data review...</p>
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
              {isEditMode ? 'Edit Review' : 'Tambah Review Baru'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Perbarui informasi testimoni'
                : 'Tambahkan testimoni baru untuk ditampilkan di beranda'}
            </p>
          </div>
          <Link href="/dashboard/admin/reviews" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-1" />
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Response */}
          {apiResponse && (
            <div className={`p-4 rounded-lg ${apiResponse.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <Icon
                  icon={apiResponse.success ? 'mdi:check-circle' : 'mdi:close-circle'}
                  className={`w-5 h-5 mt-0.5 ${apiResponse.success ? 'text-green-500' : 'text-red-500'}`}
                />
                <div>
                  <p className={`text-sm font-medium ${apiResponse.success ? 'text-green-800' : 'text-red-800'}`}>
                    {apiResponse.message}
                  </p>
                  {apiResponse.success && (
                    <p className="text-sm text-green-700 mt-1">Mengalihkan ke halaman review...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Nama */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Reviewer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Andi Pratama"
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi / Peran
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Contoh: Pelari Marathon, Pelari Pemula"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Ditampilkan di bawah nama reviewer (opsional)</p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Icon
                      icon="mdi:star"
                      className={`w-8 h-8 transition-colors ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">{formData.rating} dari 5</span>
              </div>
            </div>

            {/* Komentar */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Komentar / Testimoni <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                placeholder="Tulis testimoni dari reviewer..."
                className={`w-full px-4 py-3 border ${errors.comment ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none`}
              />
              <div className="flex justify-between mt-1">
                {errors.comment
                  ? <p className="text-sm text-red-600">{errors.comment}</p>
                  : <p className="text-xs text-gray-500">Minimal 20 karakter</p>
                }
                <p className="text-xs text-gray-400">{formData.comment.length} karakter</p>
              </div>
            </div>

            {/* Event */}
            <div>
              <label htmlFor="event_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Event
              </label>
              <input
                type="text"
                id="event_name"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="Contoh: Jakarta Marathon 2024"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Event yang diikuti reviewer (opsional)</p>
            </div>

            {/* Urutan */}
            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-2">
                Urutan Tampil
              </label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                min="0"
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Angka lebih kecil tampil lebih awal. Default: 0</p>
            </div>

            {/* Status Aktif (edit mode only) */}
            {isEditMode && (
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative" onClick={() => setIsActive(prev => !prev)}>
                    <div className={`block w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status Aktif</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isActive ? 'Review ditampilkan di beranda' : 'Review disembunyikan dari beranda'}
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" size="md" onClick={() => router.push('/dashboard/admin/reviews')} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEditMode ? 'Menyimpan...' : 'Menambahkan...'}
                </>
              ) : (
                <>
                  <Icon icon={isEditMode ? 'mdi:content-save' : 'mdi:plus'} className="w-5 h-5 mr-2" />
                  {isEditMode ? 'Simpan Perubahan' : 'Tambah Review'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
