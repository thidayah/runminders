'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Function to get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 19) return 'Selamat Sore'
  return 'Selamat Malam'
}

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth()
  const [stats, setStats] = useState({ totalEvents: 0, upcomingEvents: 0, completedEvents: 0 })
  const [recentActivity, setRecentActivity] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    if (!token) return
    setStatsLoading(true)
    try {
      const response = await fetch('/api/me/events?limit=50&sort_by=created_at&sort_order=desc', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (!data.success) return

      const items = data.data.items || []
      const now = new Date()

      setStats({
        totalEvents: data.data.pagination?.total_items ?? items.length,
        upcomingEvents: items.filter(e => new Date(e.event_date) > now && e.registration.status !== 'cancelled').length,
        completedEvents: items.filter(e => new Date(e.event_date) < now).length,
      })

      setRecentActivity(
        items.slice(0, 5).map(e => {
          const isUpcoming = new Date(e.event_date) > now
          const daysUntil = Math.ceil((new Date(e.event_date) - now) / (1000 * 60 * 60 * 24))
          if (e.registration.status === 'confirmed' && isUpcoming && daysUntil <= 14) {
            return {
              id: e.registration.id,
              icon: 'mdi:calendar-clock',
              color: 'bg-orange-100 text-orange-600',
              text: `Event <strong>${e.title}</strong> akan dimulai dalam ${daysUntil} hari`,
              date: new Date(e.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            }
          }
          if (e.registration.status === 'confirmed') {
            return {
              id: e.registration.id,
              icon: 'mdi:check-circle',
              color: 'bg-green-100 text-green-600',
              text: `Pendaftaran Anda untuk <strong>${e.title}</strong> telah dikonfirmasi`,
              date: new Date(e.registration.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            }
          }
          if (e.registration.payment_status === 'pending') {
            return {
              id: e.registration.id,
              icon: 'mdi:credit-card-clock-outline',
              color: 'bg-yellow-100 text-yellow-600',
              text: `Menunggu pembayaran untuk <strong>${e.title}</strong>`,
              date: new Date(e.registration.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            }
          }
          return {
            id: e.registration.id,
            icon: 'mdi:ticket',
            color: 'bg-blue-100 text-blue-600',
            text: `Terdaftar di event <strong>${e.title}</strong>`,
            date: new Date(e.registration.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          }
        })
      )
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex">
          {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Member'}! 
          <Icon icon="mdi:hand-wave" className=" text-accent ml-3" />
        </h1>
        <p className="text-gray-600">
          Selamat datang kembali di dashboard Runminders. Di sini Anda dapat mengelola profil, event yang anda ikuti, dan menjelajahi berbagai kegiatan lari lainnya.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Event', value: stats.totalEvents, icon: 'mdi:run' },
          { label: 'Event Mendatang', value: stats.upcomingEvents, icon: 'mdi:calendar-clock' },
          { label: 'Event Selesai', value: stats.completedEvents, icon: 'mdi:check-circle' },
        ].map((card) => (
          <div key={card.label} className="bg-linear-to-r from-primary/20 to-primary/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary mb-1">{card.label}</p>
                {statsLoading ? (
                  <div className="w-10 h-8 bg-primary/20 rounded animate-pulse mt-1" />
                ) : (
                  <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Icon icon={card.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/events">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon icon="mdi:search" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cari Event Baru</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Temukan event lari yang sesuai dengan minat Anda
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/my-events">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon icon="mdi:ticket" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Event Saya</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Lihat dan kelola semua event yang Anda ikuti
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/profile">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon icon="mdi:account" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Edit Profil</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Perbarui informasi profil dan preferensi Anda
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          {statsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-lg animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-6">
              <Icon icon="mdi:calendar-blank-outline" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada aktivitas. Yuk daftar event pertamamu!</p>
              <Link href="/events" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  <Icon icon="mdi:run" className="w-4 h-4 mr-1.5" />
                  Cari Event
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <Link key={item.id} href={`/dashboard/my-events/${item.id}`}>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon icon={item.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: item.text }} />
                        <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                      </div>
                      <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-5 text-center">
                <Link href="/dashboard/my-events">
                  <Button variant="outline" size="sm">Lihat Semua Event</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}