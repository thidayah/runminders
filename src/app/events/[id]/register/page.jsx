'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from "@/components/layout/Layout"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { formatCurrency, formatDate } from "@/lib/formatters-utils"
import { useAuth } from "@/hooks/useAuth"
import { getUser } from "@/lib/auth-storage"

export default function EventRegisterPage() {
  const user = getUser()
  const params = useParams()
  const slug = params?.id
  const router = useRouter()
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const categoryId = queryParams.get('category')

  const [event, setEvent] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    event_id: '',
    category_id: '',
    member_id: '', // Ini akan diisi dari session/auth nanti
    participant_full_name: '',
    participant_email: '',
    participant_phone: '',
    participant_gender: '',
    participant_birth_date: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    medical_conditions: '',
    blood_type: '',
    tshirt_size: '',
    payment_method: ''
  })

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!slug) {
          throw new Error('Event tidak ditemukan')
        }

        const response = await fetch(`/api/events/slug/${slug}`)

        if (response.status === 404) {
          throw new Error('Event tidak ditemukan')
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          const eventData = result.data
          setEvent(eventData)

          // Set default form values
          setFormData(prev => ({
            ...prev,
            event_id: eventData.id,
            member_id: user?.id,
            participant_email: user?.email,
            participant_full_name: user?.full_name
          }))

          // Jika ada categoryId di URL, set selected category
          if (categoryId && eventData.categories) {
            const category = eventData.categories.find(cat => cat.id === categoryId)
            if (category) {
              setSelectedCategory(category)
              setFormData(prev => ({
                ...prev,
                category_id: category.id,
                payment_method: eventData.is_free ? 'free' : 'bank_transfer'
              }))
            }
          }
        } else {
          throw new Error(result.message || 'Data event tidak valid')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError(err.message || 'Terjadi kesalahan saat memuat event')
      } finally {
        setLoading(false)
      }
    }

    if (!user) {
      return router.push(`/login`)
    }

    if (slug) {
      fetchEventData()
    } else {
      setLoading(false)
      setError('Event tidak ditemukan')
    }
  }, [slug, categoryId])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setFormData(prev => ({
      ...prev,
      category_id: category.id,
      payment_method: event.is_free ? 'free' : 'bank_transfer'
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCategory) {
      setError('Pilih kategori terlebih dahulu')
      return
    }

    if (!formData.participant_full_name || !formData.participant_email) {
      setError('Nama lengkap dan email wajib diisi')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        // Jika berbayar dan ada snap_transaction, redirect ke Midtrans
        if (!event.is_free && result.data.snap_transaction?.redirect_url) {
          // window.location.href = result.data.snap_transaction.redirect_url
          window.location.assign(result.data.snap_transaction.redirect_url)
        } else {
          router.push(`/dashboard/my-events`)
        }
      } else {
        setError(result.message || 'Gagal melakukan registrasi')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Terjadi kesalahan saat melakukan registrasi')
    } finally {
      setSubmitting(false)
    }
  }

  const getPrice = () => {
    let price = event?.has_early_bird && new Date(event.early_bird_end_date) > new Date() &&
      selectedCategory?.early_bird_price
      ? selectedCategory?.early_bird_price
      : selectedCategory?.price || 0

    return formatCurrency(price)
  }
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-primary to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-100 mt-2">Memuat...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br bg-primary to-white">
          <div className="text-center flex justify-center flex-col items-center max-w-lg">
            <Icon icon="mdi:alert-circle-outline" className="size-20 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-6">
              {error || 'Kategori Event yang Anda cari tidak dapat ditemukan.'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/events/${slug}`}>
                <Button variant="outline" size="md">
                  Kembali ke Detail Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Main registration form
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="relative bg-gradient-to-br bg-primary via-primary to-white">
          {/* Background Gradient */}
          <div className="h-64 bg-cover bg-center" >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 mt-16">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-light mb-4">
                Form Registrasi
              </h1>
              {/* Breadcrumb */}
              <div className="">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Link href="/events" className="text-gray-300 hover:text-gray-400">
                        Events
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <Icon icon="mdi:chevron-right" className="text-gray-100" />
                        <Link href={`/events/${slug}`} className="ml-1 text-gray-300 hover:text-gray-400 md:ml-2">
                          {event.title}
                        </Link>
                      </div>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <Icon icon="mdi:chevron-right" className="text-gray-100" />
                        <span className="ml-1 text-gray-300 font-semibold md:ml-2">Registrasi</span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Form Header */}
                {/* <div className="bg-gradient-to-r bg-primary via-primary p-6 text-white">
                  <h1 className="text-2xl font-bold">Form Registrasi</h1>
                  <p className="text-gray-200 mt-1">Lengkapi data diri Anda untuk mendaftar event</p>
                </div> */}

                <form onSubmit={handleSubmit} className="p-6">
                  {/* Category Selection */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Pilih Kategori</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {event.categories.map((category) => {
                        const isEarlyBird = event.has_early_bird &&
                          new Date(event.early_bird_end_date) > new Date() &&
                          category.early_bird_price

                        const displayPrice = isEarlyBird ? category.early_bird_price : category.price

                        return (
                          <div
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className={`relative p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedCategory?.id === category.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="flex justify-between items-start ">
                              <div>
                                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                {category.distance && (
                                  <p className="text-sm text-gray-600">{category.distance}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary text-lg">
                                  {formatCurrency(displayPrice)}
                                </div>
                                {isEarlyBird && (
                                  <div className="text-xs text-gray-500 line-through">
                                    {formatCurrency(category.price)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {isEarlyBird && (
                              <div className="absolute -top-3 left-4 inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                Early Bird
                              </div>
                            )}

                            {/* {category.description && (
                              <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                            )} */}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Data Pribadi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          name="participant_full_name"
                          value={formData.participant_full_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent"
                          placeholder="Masukan nama lengkap"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="participant_email"
                          value={formData.participant_email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent"
                          placeholder="example@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          No. Telepon
                        </label>
                        <input
                          type="tel"
                          name="participant_phone"
                          value={formData.participant_phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent"
                          placeholder="0812xxxxxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Kelamin
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent">
                          <select
                            name="participant_gender"
                            value={formData.participant_gender}
                            onChange={handleInputChange}
                            className=" focus:outline-none w-full"
                          >
                            <option value="">Pilih</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          name="participant_birth_date"
                          value={formData.participant_birth_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent"
                        />
                      </div>

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ukuran Kaos
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent">
                          <select
                            name="tshirt_size"
                            value={formData.tshirt_size}
                            onChange={handleInputChange}
                            className=" focus:outline-none w-full"
                          >
                            <option value="">Pilih...</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                          </select>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Kontak Darurat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Kontak Darurat
                        </label>
                        <input
                          type="text"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:outline-0 focus:border-transparent"
                          placeholder="Masukan nama kontak darurat"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          No. Telepon Darurat
                        </label>
                        <input
                          type="tel"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent"
                          placeholder="0812xxxxxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hubungan
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent">
                          <select
                            name="emergency_contact_relation"
                            value={formData.emergency_contact_relation}
                            onChange={handleInputChange}
                            className=" focus:outline-none w-full"
                          >
                            <option value="">Pilih</option>
                            <option value="Orang Tua">Orang Tua</option>
                            <option value="Pasangan">Pasangan</option>
                            <option value="Saudara">Saudara</option>
                            <option value="Teman">Teman</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Golongan Darah
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent">
                          <select
                            name="blood_type"
                            value={formData.blood_type}
                            onChange={handleInputChange}
                            className=" focus:outline-none w-full"
                          >
                            <option value="">Pilih</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="O">O</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kondisi Medis
                        </label>
                        <textarea
                          name="medical_conditions"
                          value={formData.medical_conditions}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-0 focus:border-transparent"
                          placeholder="Contoh: Asma, alergi makanan, dll."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t pt-4">
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error || 'Terjadi kesalahan.'}</p>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    <div className="flex items-start mb-4">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => {
                          setAcceptTerms(e.target.checked)
                        }}
                        className={`w-4 h-4 'text-primary border-gray-300 rounded mt-1 focus:ring-primary`}
                        required
                      />
                      <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                        Dengan mendaftar, Saya menyetujui {' '}
                        <button type="button" className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-semibold">
                          Syarat & Ketentuan
                        </button>{' '}
                        yang berlaku.
                      </label>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={!selectedCategory || submitting}
                    >
                      {submitting ? 'Memproses...' : event.is_free ? 'Daftar Gratis' : 'Lanjutkan ke Pembayaran'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24 overflow-hidden">
                {/* Event Summary Header */}
                <div className="bg-primary p-6 text-white">
                  <h2 className="text-xl font-bold">Ringkasan Event</h2>
                </div>

                <div className="p-6">
                  {/* Event Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:calendar" width="16" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:map-marker" width="16" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Category */}
                  {selectedCategory && (
                    <div className="border-t pt-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Kategori Terpilih</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-gray-800">{selectedCategory.name}</div>
                            {selectedCategory.distance && (
                              <div className="text-sm text-gray-600">{selectedCategory.distance}</div>
                            )}
                          </div>
                          <div className="font-bold text-primary">{getPrice()}</div>
                        </div>

                        {/* {event.has_early_bird &&
                          new Date(event.early_bird_end_date) > new Date() &&
                          selectedCategory.early_bird_price && (
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-red-600 font-medium">Early Bird</span>
                              <span className="text-gray-500 line-through ml-2">
                                {formatCurrency(selectedCategory.price)}
                              </span>
                            </div>
                          )} */}
                      </div>
                    </div>
                  )}

                  {/* Payment Summary */}
                  {!event.is_free && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Rincian Biaya</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Biaya Pendaftaran</span>
                          <span>{getPrice()}</span>
                        </div>
                        {/* <div className="flex justify-between">
                          <span>Biaya Admin</span>
                          <span>{formatCurrency(5000)}</span>
                        </div> */}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">{getPrice()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Important Notes */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Informasi</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Icon icon="mdi:information" width="14" className="text-primary mt-0.5" />
                        <span>Pastikan data yang diisi sudah benar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon icon="mdi:information" width="14" className="text-primary mt-0.5" />
                        <span>Pembayaran tidak dapat dibatalkan setelah diproses</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon icon="mdi:information" width="14" className="text-primary mt-0.5" />
                        <span>Konfirmasi akan dikirim via email</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}