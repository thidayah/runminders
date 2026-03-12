'use client'

import { useEffect, useState } from 'react'
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
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0
  })

  // Fetch user stats (placeholder - integrate with your API)
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      
      try {
        // This is placeholder - replace with your actual API call
        // const response = await fetch(`/api/dashboard/stats?member_id=${user.id}`)
        // const data = await response.json()
        
        // Simulated data
        setStats({
          totalEvents: 3,
          upcomingEvents: 1,
          completedEvents: 2
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [user])

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
        <div className="bg-gradient-to-r from-primary/20 to-primary/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-primary mb-1">Total Event</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalEvents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Icon icon="mdi:run" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-primary/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-primary mb-1">Event Mendatang</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Icon icon="mdi:calendar-clock" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-primary/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-primary mb-1">Event Selesai</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.completedEvents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Icon icon="mdi:check-circle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
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
      <div className="hidden">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="space-y-4">
            {/* Placeholder activity items */}
            <div className="flex items-center space-x-4 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Pendaftaran Anda untuk <strong>Marathon Jakarta 2024</strong> telah dikonfirmasi
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hari yang lalu</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-white rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Icon icon="mdi:calendar" className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Event <strong>Night Run Surabaya</strong> akan dimulai dalam 3 hari
                </p>
                <p className="text-xs text-gray-500 mt-1">5 hari yang lalu</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/dashboard/my-events">
              <Button variant="outline" size="sm">
                Lihat Semua Aktivitas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}