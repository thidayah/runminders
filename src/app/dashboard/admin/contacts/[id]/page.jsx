'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function AdminContactDetailPage() {
  const { user, token, isLoading: authLoading } = useAuth()
  const { id } = useParams()
  const router = useRouter()

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchMessage()
    }
  }, [authLoading, user, id])

  const fetchMessage = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await response.json()

      if (!result.success) throw new Error(result.message)

      setMessage(result.data)

      // Auto-mark as read jika masih baru
      if (result.data.status === 'new') {
        updateStatus('read', result.data)
      }
    } catch (err) {
      console.error('Error fetching message:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus, currentMessage = message) => {
    if (!currentMessage || currentMessage.status === newStatus) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()
      if (result.success) {
        setMessage(result.data)
      } else {
        console.error('Gagal update status:', result.message)
      }
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = await response.json()
      if (result.success) {
        router.push('/dashboard/admin/contacts')
      } else {
        alert(result.message || 'Gagal menghapus pesan')
        setIsDeleteDialogOpen(false)
      }
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.')
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/admin/contacts')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pesan</h1>
            <p className="text-gray-600 mt-0.5 text-sm">Pesan dari form kontak publik</p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Memuat pesan...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto" />
            <p className="mt-4 text-gray-600">{error}</p>
            <button
              onClick={fetchMessage}
              className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto gap-2"
            >
              <Icon icon="mdi:refresh" className="w-5 h-5" />
              Coba Lagi
            </button>
          </div>
        ) : message && (
          <>
            {/* Info Pengirim */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-lg">
                      {message.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{message.name}</div>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-primary hover:underline text-sm"
                    >
                      {message.email}
                    </a>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border self-start ${STATUS_STYLES[message.status]}`}>
                  {STATUS_LABELS[message.status]}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                <div>
                  <span className="text-gray-500">Subjek</span>
                  <p className="font-medium text-gray-800 mt-0.5">{message.subject}</p>
                </div>
                <div>
                  <span className="text-gray-500">Diterima</span>
                  <p className="font-medium text-gray-800 mt-0.5">
                    {formatDate(message.created_at, {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Isi Pesan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Isi Pesan</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.message}</p>
            </div>

            {/* Aksi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tindakan</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Update Status */}
                <div className="flex items-center gap-2 flex-1">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Ubah status:</label>
                  <select
                    value={message.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    disabled={isUpdating}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-0 disabled:opacity-60"
                  >
                    <option value="new">Baru</option>
                    <option value="read">Dibaca</option>
                    <option value="replied">Dibalas</option>
                  </select>
                  {isUpdating && (
                    <Icon icon="mdi:loading" className="w-4 h-4 text-gray-400 animate-spin shrink-0" />
                  )}
                </div>

                {/* Balas via Email */}
                <a
                  href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                  onClick={() => {
                    if (message.status !== 'replied') updateStatus('replied')
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <Icon icon="mdi:reply" className="w-4 h-4" />
                  Balas via Email
                </a>

                {/* Hapus */}
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isDeleting && setIsDeleteDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <Icon icon="mdi:delete-outline" className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hapus Pesan</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Pesan dari <strong>{message?.name}</strong> akan dihapus secara permanen dan tidak dapat dipulihkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? (
                  <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon icon="mdi:delete-outline" className="w-4 h-4" />
                )}
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
