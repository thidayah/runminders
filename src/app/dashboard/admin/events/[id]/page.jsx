'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function EventFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const isEditMode = id && id !== 'create'

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    event_date: '',
    event_time: '',
    location: '',
    location_link: '',
    address: '',
    coordinates: '',
    is_virtual: false,
    location_type: 'offline',
    is_free: false,
    base_price: '',
    has_early_bird: false,
    early_bird_price: '',
    early_bird_end_date: '',
    max_participants: '',
    highlights: [''],
    schedule: [{ time: '', activity: '' }],
    requirements: [''],
    registration_open_date: '',
    registration_close_date: '',
    slug: '',
    organizer_name: '',
    categories: [
      {
        name: '',
        description: '',
        distance: '',
        price: '',
        early_bird_price: '',
        max_slots: '',
        display_order: 1
      }
    ]
  })

  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditMode)
  const [errors, setErrors] = useState({})
  const [apiResponse, setApiResponse] = useState(null)

  // Fetch data jika edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchEventDetail()
    }
  }, [id])

  const fetchEventDetail = async () => {
    try {
      setIsFetching(true)
      setErrors({})

      const response = await fetch(`/api/events/${id}`)

      if (!response.ok) {
        throw new Error('Gagal mengambil data event')
      }

      const result = await response.json()

      if (result.success) {
        const event = result.data

        // Format dates untuk input
        const formatDateForInput = (dateString) => {
          if (!dateString) return ''
          const date = new Date(dateString)
          return date.toISOString().split('T')[0]
        }

        setFormData({
          title: event.title || '',
          subtitle: event.subtitle || '',
          description: event.description || '',
          image_url: event.image_url || '',
          event_date: formatDateForInput(event.event_date) || '',
          event_time: event.event_time?.substring(0, 5) || '',
          location: event.location || '',
          location_link: event.location_link || '',
          address: event.address || '',
          coordinates: event.coordinates ? JSON.stringify(event.coordinates) : '',
          is_virtual: event.is_virtual || false,
          location_type: event.location_type || 'offline',
          is_free: event.is_free || false,
          base_price: event.base_price || '',
          has_early_bird: event.has_early_bird || false,
          early_bird_price: event.early_bird_price || '',
          early_bird_end_date: formatDateForInput(event.early_bird_end_date) || '',
          max_participants: event.max_participants || '',
          highlights: event.highlights?.length ? event.highlights : [''],
          schedule: event.schedule?.length ? event.schedule : [{ time: '', activity: '' }],
          requirements: event.requirements?.length ? event.requirements : [''],
          registration_open_date: formatDateForInput(event.registration_open_date) || '',
          registration_close_date: formatDateForInput(event.registration_close_date) || '',
          slug: event.slug || '',
          organizer_name: event.organizer_name || '',
          categories: event.categories?.length ? event.categories.map(cat => ({
            id: cat.id,
            name: cat.name || '',
            description: cat.description || '',
            distance: cat.distance || '',
            price: cat.price || '',
            early_bird_price: cat.early_bird_price || '',
            max_slots: cat.max_slots || '',
            display_order: cat.display_order || 1,
            is_active: cat.is_active
          })) : [{
            name: '',
            description: '',
            distance: '',
            price: '',
            early_bird_price: '',
            max_slots: '',
            display_order: 1
          }]
        })
        setIsActive(event.is_active)
      } else {
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (err) {
      console.error('Error fetching event:', err)
      setApiResponse({
        success: false,
        message: err.message
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleCategoryChange = (index, field, value) => {
    setFormData(prev => {
      const newCategories = [...prev.categories]
      newCategories[index] = { ...newCategories[index], [field]: value }
      return { ...prev, categories: newCategories }
    })
  }

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name: '',
          description: '',
          distance: '',
          price: '',
          early_bird_price: '',
          max_slots: '',
          display_order: prev.categories.length + 1
        }
      ]
    }))
  }

  const removeCategory = (index) => {
    if (formData.categories.length <= 1) {
      alert('Minimal harus ada 1 kategori')
      return
    }
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }))
  }

  const handleScheduleChange = (index, field, value) => {
    setFormData(prev => {
      const newSchedule = [...prev.schedule]
      newSchedule[index] = { ...newSchedule[index], [field]: value }
      return { ...prev, schedule: newSchedule }
    })
  }

  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: '', activity: '' }]
    }))
  }

  const removeScheduleItem = (index) => {
    if (formData.schedule.length <= 1) {
      alert('Minimal harus ada 1 jadwal')
      return
    }
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Judul event harus diisi'
    if (!formData.event_date) newErrors.event_date = 'Tanggal event harus diisi'
    if (!formData.location.trim()) newErrors.location = 'Lokasi harus diisi'
    if (!formData.organizer_name.trim()) newErrors.organizer_name = 'Nama organizer harus diisi'
    if (!formData.max_participants) newErrors.max_participants = 'Kuota maksimal harus diisi'
    if (!formData.registration_open_date) newErrors.registration_open_date = 'Tanggal buka pendaftaran harus diisi'
    if (!formData.registration_close_date) newErrors.registration_close_date = 'Tanggal tutup pendaftaran harus diisi'

    // Validasi kategori
    formData.categories.forEach((cat, index) => {
      if (!cat.name.trim()) {
        newErrors[`category_${index}_name`] = `Nama kategori ${index + 1} harus diisi`
      }
      if (!cat.price && !formData.is_free) {
        newErrors[`category_${index}_price`] = `Harga kategori ${index + 1} harus diisi`
      }
      if (!cat.max_slots) {
        newErrors[`category_${index}_slots`] = `Kuota kategori ${index + 1} harus diisi`
      }
    })

    return newErrors
  }

  const preparePayload = () => {
    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || null,
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      event_date: formData.event_date,
      event_time: formData.event_time || null,
      location: formData.location.trim(),
      location_link: formData.location_link.trim() || null,
      address: formData.address.trim() || null,
      coordinates: formData.coordinates ? formData.coordinates : null,
      is_virtual: formData.location_type !== 'offline',
      location_type: formData.location_type,
      is_free: formData.is_free,
      base_price: formData.is_free ? 0 : parseFloat(formData.base_price) || 0,
      has_early_bird: formData.has_early_bird,
      early_bird_price: formData.has_early_bird ? parseFloat(formData.early_bird_price) : null,
      early_bird_end_date: formData.has_early_bird ? formData.early_bird_end_date : null,
      max_participants: parseInt(formData.max_participants),
      highlights: formData.highlights.filter(h => h.trim() !== ''),
      schedule: formData.schedule.filter(s => s.time.trim() !== '' && s.activity.trim() !== ''),
      requirements: formData.requirements.filter(r => r.trim() !== ''),
      registration_open_date: formData.registration_open_date,
      registration_close_date: formData.registration_close_date,
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      organizer_name: formData.organizer_name.trim(),
      categories: formData.categories
        .filter(cat => cat.name.trim() !== '')
        .map(cat => ({
          ...(cat.id && { id: cat.id }),
          name: cat.name.trim(),
          description: cat.description.trim() || null,
          distance: cat.distance.trim() || null,
          price: formData.is_free ? 0 : parseFloat(cat.price) || 0,
          early_bird_price: formData.has_early_bird && cat.early_bird_price ? parseFloat(cat.early_bird_price) : null,
          max_slots: parseInt(cat.max_slots),
          display_order: cat.display_order
        }))
    }

    // Add is_active only for edit mode
    if (isEditMode) {
      payload.is_active = isActive
    }

    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsLoading(true)
    setApiResponse(null)

    try {
      const url = isEditMode ? `/api/events/${id}` : '/api/events'
      const method = isEditMode ? 'PUT' : 'POST'
      const payload = preparePayload()

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        // Redirect ke list events setelah sukses
        setTimeout(() => {
          router.push('/dashboard/admin/events')
          router.refresh()
        }, 1500)

        setApiResponse({
          success: true,
          message: isEditMode ? 'Event berhasil diperbarui!' : 'Event berhasil ditambahkan!'
        })
      } else {
        setApiResponse({
          success: false,
          message: result.message || 'Terjadi kesalahan'
        })
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setApiResponse({
        success: false,
        message: 'Terjadi kesalahan jaringan. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/admin/events')
  }

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data event...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Event' : 'Buat Event Baru'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Perbarui informasi event yang sudah ada'
                : 'Tambahkan event lari baru ke platform'}
            </p>
          </div>
          <Link
            href="/dashboard/admin/events"
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
                      Mengalihkan ke halaman event...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Informasi Dasar</h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Judul Event <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Jakarta International Marathon 2024"
                className={`w-full px-4 py-3 border ${errors.title ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Tagline singkat untuk event"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Deskripsi lengkap tentang event..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                URL Gambar Banner
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL gambar untuk banner event (opsional)
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Event <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.event_date ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary`}
                />
                {errors.event_date && <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>}
              </div>
              <div>
                <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Mulai
                </label>
                <input
                  type="time"
                  id="event_time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Lokasi
              </label>
              <div className="flex space-x-4">
                {['offline', 'virtual', 'hybrid'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="location_type"
                      value={type}
                      checked={formData.location_type === type}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={formData.location_type === 'virtual' ? 'Online - Dimana Saja' : 'Nama tempat/venue'}
                className={`w-full px-4 py-3 border ${errors.location ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Alamat lengkap venue"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Location Link (Embed) */}
            <div>
              <label htmlFor="location_link" className="block text-sm font-medium text-gray-700 mb-2">
                Embed Map / Virtual Link
              </label>
              <textarea
                id="location_link"
                name="location_link"
                value={formData.location_link}
                onChange={handleChange}
                rows={3}
                placeholder="<iframe src='...'></iframe> atau URL meeting"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            </div>

            {/* Organizer */}
            <div>
              <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Organizer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="organizer_name"
                name="organizer_name"
                value={formData.organizer_name}
                onChange={handleChange}
                placeholder="Nama komunitas/penyelenggara"
                className={`w-full px-4 py-3 border ${errors.organizer_name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary`}
              />
              {errors.organizer_name && <p className="mt-1 text-sm text-red-600">{errors.organizer_name}</p>}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="nama-event-untuk-url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500">
                Kosongkan untuk generate otomatis dari judul
              </p>
            </div>
          </div>

          {/* Pricing & Registration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">Harga & Pendaftaran</h2>

            {/* Free/Paid Toggle */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_free"
                  checked={formData.is_free}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Event Gratis</span>
              </label>
            </div>

            {!formData.is_free && (
              <>
                {/* Base Price */}
                <div>
                  <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Dasar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="base_price"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleChange}
                    min="0"
                    placeholder="250000"
                    className={`w-full px-4 py-3 border ${errors.base_price ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-primary`}
                  />
                </div>

                {/* Early Bird Toggle */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="has_early_bird"
                      checked={formData.has_early_bird}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Ada Early Bird</span>
                  </label>

                  {formData.has_early_bird && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                      <div>
                        <label htmlFor="early_bird_price" className="block text-sm font-medium text-gray-700 mb-2">
                          Harga Early Bird
                        </label>
                        <input
                          type="number"
                          id="early_bird_price"
                          name="early_bird_price"
                          value={formData.early_bird_price}
                          onChange={handleChange}
                          min="0"
                          placeholder="200000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label htmlFor="early_bird_end_date" className="block text-sm font-medium text-gray-700 mb-2">
                          Berakhir Tanggal
                        </label>
                        <input
                          type="date"
                          id="early_bird_end_date"
                          name="early_bird_end_date"
                          value={formData.early_bird_end_date}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Max Participants */}
            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-2">
                Kuota Maksimal Peserta <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="max_participants"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                min="1"
                placeholder="3500"
                className={`w-full px-4 py-3 border ${errors.max_participants ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-primary`}
              />
              {errors.max_participants && <p className="mt-1 text-sm text-red-600">{errors.max_participants}</p>}
            </div>

            {/* Registration Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="registration_open_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Pendaftaran Dibuka <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="registration_open_date"
                  name="registration_open_date"
                  value={formData.registration_open_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.registration_open_date ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary`}
                />
                {errors.registration_open_date && <p className="mt-1 text-sm text-red-600">{errors.registration_open_date}</p>}
              </div>
              <div>
                <label htmlFor="registration_close_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Pendaftaran Ditutup <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="registration_close_date"
                  name="registration_close_date"
                  value={formData.registration_close_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.registration_close_date ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary`}
                />
                {errors.registration_close_date && <p className="mt-1 text-sm text-red-600">{errors.registration_close_date}</p>}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 flex-1">Kategori Event</h2>
              <button
                type="button"
                onClick={addCategory}
                className="flex items-center text-primary hover:text-primary/80 text-sm font-medium"
              >
                <Icon icon="mdi:plus-circle" className="w-5 h-5 mr-1" />
                Tambah Kategori
              </button>
            </div>

            {formData.categories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-700">Kategori {index + 1}</h3>
                  {formData.categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Icon icon="mdi:delete" className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Kategori <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                      placeholder="Marathon (42K)"
                      className={`w-full px-3 py-2 border ${errors[`category_${index}_name`] ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jarak (Distance)
                    </label>
                    <input
                      type="text"
                      value={category.distance}
                      onChange={(e) => handleCategoryChange(index, 'distance', e.target.value)}
                      placeholder="42K, 21K, 10K"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={category.description}
                    onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                    rows={2}
                    placeholder="Deskripsi kategori..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harga <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={category.price}
                      onChange={(e) => handleCategoryChange(index, 'price', e.target.value)}
                      placeholder="450000"
                      className={`w-full px-3 py-2 border ${errors[`category_${index}_price`] ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg`}
                      disabled={formData.is_free}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Early Bird Price
                    </label>
                    <input
                      type="number"
                      value={category.early_bird_price}
                      onChange={(e) => handleCategoryChange(index, 'early_bird_price', e.target.value)}
                      placeholder="400000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!formData.has_early_bird || formData.is_free}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kuota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={category.max_slots}
                      onChange={(e) => handleCategoryChange(index, 'max_slots', e.target.value)}
                      placeholder="2000"
                      className={`w-full px-3 py-2 border ${errors[`category_${index}_slots`] ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Highlights</h2>
              <button
                type="button"
                onClick={() => addArrayItem('highlights', '')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                <Icon icon="mdi:plus" className="w-4 h-4 inline mr-1" />
                Tambah
              </button>
            </div>

            {formData.highlights.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                  placeholder={`Highlight ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('highlights', index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Jadwal Event</h2>
              <button
                type="button"
                onClick={addScheduleItem}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                <Icon icon="mdi:plus" className="w-4 h-4 inline mr-1" />
                Tambah Jadwal
              </button>
            </div>

            {formData.schedule.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                  placeholder="Waktu (03:00)"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={item.activity}
                  onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)}
                  placeholder="Aktivitas"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Persyaratan</h2>
              <button
                type="button"
                onClick={() => addArrayItem('requirements', '')}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                <Icon icon="mdi:plus" className="w-4 h-4 inline mr-1" />
                Tambah
              </button>
            </div>

            {formData.requirements.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  placeholder={`Persyaratan ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Status Active (Hanya untuk Edit Mode) */}
          {isEditMode && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                  <span className="text-sm font-medium text-gray-700">Status Event</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isActive
                      ? 'Event aktif dan bisa dilihat publik'
                      : 'Event tidak ditampilkan di halaman publik'}
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Created/Updated Info (Hanya untuk Edit Mode) */}
          {isEditMode && formData.created_at && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                  {isEditMode ? 'Simpan Perubahan' : 'Buat Event'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}