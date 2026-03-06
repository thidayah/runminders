'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export default function MyEventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)

  const registrationId = params.id

  // Fetch event detail
  useEffect(() => {
    if (!token || !registrationId) return

    const fetchEventDetail = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/my-events/${registrationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          console.error('Failed to fetch event detail:', result.message)
          router.push('/dashboard/my-events')
        }
      } catch (error) {
        console.error('Error fetching event detail:', error)
        router.push('/dashboard/my-events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventDetail()
  }, [token, registrationId, router])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString, options = {}) => {
    const defaultOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }
    return new Date(dateString).toLocaleDateString('id-ID', defaultOptions)
  }

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate admin fee from payment transactions
  const calculateAdminFee = () => {
    if (!data?.payment_transactions?.[0]?.raw_response?.metadata?.extra_info?.gross_amount_info) {
      return 0
    }

    const grossAmountInfo = data.payment_transactions[0].raw_response.metadata.extra_info.gross_amount_info
    return parseInt(grossAmountInfo.customer_imposed_payment_fee) || 0
  }

  // Handle print
  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Get payment status badge style
  const getPaymentStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail event...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Icon icon="mdi:alert-circle" className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Event tidak ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Event yang Anda cari tidak ditemukan atau Anda tidak memiliki akses.
            </p>
            <Link href="/dashboard/my-events">
              <Button>
                <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
                Kembali ke Event Saya
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { registration, event, category, payment_transactions } = data
  const paymentTransaction = payment_transactions?.[0]
  const adminFee = calculateAdminFee()
  const totalAmount = (category?.price || 0) + adminFee

  return (
    <DashboardLayout>
      <div className="py-8">
        {/* Header with Actions */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <Link
              href="/dashboard/my-events"
              className="inline-flex items-center text-primary hover:text-primary-dark mb-2"
            >
              <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-1" />
              Kembali ke Event Saya
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Detail Registrasi Event
            </h1>
            <p className="text-gray-600 mt-1">
              {event.title} - {registration.registration_number}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isPrinting}
            >
              <Icon icon="mdi:printer" className="w-5 h-5 mr-2" />
              {isPrinting ? 'Mempersiapkan...' : 'Cetak Invoice'}
            </Button>

            {registration.payment_status === 'pending' && (
              <Button>
                <Icon icon="mdi:credit-card" className="w-5 h-5 mr-2" />
                Lanjutkan Pembayaran
              </Button>
            )}
          </div>
        </div>

        {/* Main Content - Printable Area */}
        <div id="printable-area" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Invoice Header */}
          <div className="print:border-b print:border-gray-300 print:pb-4 print:mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">No. Registrasi:</span> {registration.registration_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tanggal:</span> {formatDate(registration.registration_date, { weekday: undefined })}
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:text-right">
                <div className="flex items-center md:justify-end space-x-3">
                  <div className="text-center md:text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(registration.status)}`}>
                      <Icon
                        icon={registration.status === 'confirmed' ? 'mdi:check-circle' :
                          registration.status === 'pending' ? 'mdi:clock' :
                            registration.status === 'cancelled' ? 'mdi:close-circle' : 'mdi:help-circle'}
                        className="w-4 h-4 mr-1.5"
                      />
                      {registration.status === 'confirmed' ? 'Terkonfirmasi' :
                        registration.status === 'pending' ? 'Menunggu Konfirmasi' :
                          registration.status === 'cancelled' ? 'Dibatalkan' : registration.status}
                    </span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusBadge(registration.payment_status)}`}>
                        <Icon
                          icon={registration.payment_status === 'paid' ? 'mdi:check-circle' :
                            registration.payment_status === 'pending' ? 'mdi:clock' :
                              registration.payment_status === 'failed' ? 'mdi:close-circle' : 'mdi:help-circle'}
                          className="w-4 h-4 mr-1.5"
                        />
                        {registration.payment_status === 'paid' ? 'Lunas' :
                          registration.payment_status === 'pending' ? 'Menunggu Pembayaran' :
                            registration.payment_status === 'failed' ? 'Gagal' : registration.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="print:grid print:grid-cols-2 print:gap-8 mt-8">
            {/* Event Information */}
            <div className="mb-8 print:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Informasi Event</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama Event</p>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  {event.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{event.subtitle}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Event</p>
                    <p className="font-medium text-gray-900">{formatDate(event.event_date)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="inline-flex items-center">
                        <Icon icon={event.location_type === 'virtual' ? 'mdi:monitor' : 'mdi:map-marker'} className="w-4 h-4 mr-1" />
                        {event.location_type === 'virtual' ? 'Online / Virtual' : 'Offline / Tatap Muka'}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Penyelenggara</p>
                  <p className="font-medium text-gray-900">{event.organizer_name}</p>
                </div>
              </div>
            </div>

            {/* Participant Information */}
            <div className="mb-8 print:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Informasi Peserta</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama Peserta</p>
                  <p className="font-medium text-gray-900">{registration.participant_full_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{registration.participant_email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="font-medium text-gray-900">{registration.participant_phone}</p>
                  </div>
                </div>

                {registration.emergency_contact_name && (
                  <div>
                    <p className="text-sm text-gray-600">Kontak Darurat</p>
                    <p className="font-medium text-gray-900">{registration.emergency_contact_name}</p>
                    <p className="text-sm text-gray-600">{registration.emergency_contact_phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category & Pricing Information */}
          <div className="mt-8 print:mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Detail Kategori & Biaya</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{category?.name || 'Kategori Reguler'}
                      {category?.distance && (
                        <span className="text-sm text-gray-600 ml-2">
                          Jarak: {category.distance}
                        </span>
                      )}
                    </p>
                    {/* {category?.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    )} */}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {event.is_free ? 'GRATIS' : formatCurrency(category?.price || 0)}
                    </p>
                  </div>
                </div>

                {!event.is_free && adminFee > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <div>
                      <p className="text-gray-700">Biaya Admin
                        <span className="text-sm text-gray-600 ml-2">
                          Biaya transaksi pembayaran
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{formatCurrency(adminFee)}</p>
                    </div>
                  </div>
                )}

                {!event.is_free && (
                  <div className="flex justify-between items-center pt-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">Total Pembayaran</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information (Only for pending payments) */}
          {registration.payment_status === 'pending' && paymentTransaction && (
            <div className="mt-8 print:mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Instruksi Pembayaran</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</p>
                    <p className="text-lg font-bold text-gray-900 uppercase">
                      {paymentTransaction.payment_type === 'bank_transfer' ? 'Transfer Bank' : paymentTransaction.payment_type}
                    </p>
                  </div>

                  {paymentTransaction.raw_response?.va_numbers?.[0] && (
                    <div className="bg-white p-4 rounded-lg border border-gray-300">
                      <p className="text-sm font-medium text-gray-700 mb-1">Virtual Account Number</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-700">
                              {paymentTransaction.raw_response.va_numbers[0].bank.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 tracking-wider">
                              {paymentTransaction.raw_response.va_numbers[0].va_number}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Nomor Virtual Account</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentTransaction.raw_response.va_numbers[0].va_number)
                          }}
                        >
                          <Icon icon="mdi:content-copy" className="w-4 h-4 mr-2" />
                          Salin
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentTransaction.raw_response?.expiry_time && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Icon icon="mdi:clock-alert" className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Batas Waktu Pembayaran</p>
                          <p className="text-lg font-bold text-yellow-900">
                            {new Date(paymentTransaction.raw_response.expiry_time).toLocaleString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Petunjuk Pembayaran:</p>
                    <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                      <li>Buka aplikasi atau website bank Anda</li>
                      <li>Pilih menu Transfer / Virtual Account</li>
                      <li>Masukkan nomor virtual account di atas</li>
                      <li>Periksa nominal yang tertera dan konfirmasi</li>
                      <li>Simpan bukti pembayaran Anda</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Timeline */}
          <div className="mt-8 print:hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Timeline Registrasi</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pendaftaran Berhasil</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(registration.registration_date)} - {formatTime(registration.registration_date)}
                  </p>
                </div>
              </div>

              {paymentTransaction?.transaction_time && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Icon icon="mdi:credit-card" className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Transaksi Pembayaran Dibuat</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(paymentTransaction.transaction_time)} - {formatTime(paymentTransaction.transaction_time)}
                    </p>
                  </div>
                </div>
              )}

              {registration.payment_status === 'paid' && registration.payment_date && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Icon icon="mdi:cash-check" className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pembayaran Dikonfirmasi</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(registration.payment_date)} - {formatTime(registration.payment_date)}
                    </p>
                  </div>
                </div>
              )}

              {registration.status === 'confirmed' && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Icon icon="mdi:ticket-confirmation" className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Registrasi Dikonfirmasi</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(registration.updated_at)} - {formatTime(registration.updated_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium text-gray-900">Catatan Penting:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Simpan invoice ini sebagai bukti pendaftaran</li>
                <li>Untuk event offline, datang tepat waktu sesuai jadwal</li>
                <li>Bawa identitas diri yang valid saat check-in</li>
                <li>Hubungi panitia jika ada pertanyaan atau masalah</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between print:hidden">
          <div className="text-sm text-gray-600">
            <p>Terakhir diperbarui: {formatDate(registration.updated_at)}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href={`/events/${event.id}`}>
              <Button variant="outline">
                <Icon icon="mdi:information" className="w-5 h-5 mr-2" />
                Lihat Detail Event
              </Button>
            </Link>
            <Link href="/dashboard/my-events">
              <Button variant="outline">
                <Icon icon="mdi:arrow-left" className="w-5 h-5 mr-2" />
                Kembali ke List
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:border-b {
            border-bottom: 1px solid #d1d5db !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:grid {
            display: grid !important;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: 1fr 1fr !important;
          }
          .print\\:gap-8 {
            gap: 2rem !important;
          }
          .print\\:mt-4 {
            margin-top: 1rem !important;
          }
          .print\\:pb-4 {
            padding-bottom: 1rem !important;
          }
        }
      `}</style>
    </DashboardLayout>
  )
}