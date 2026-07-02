'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

const quickLinks = [
  { label: 'Tambah Event', href: '/dashboard/admin/events/create', icon: 'mdi:calendar-plus', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Kelola Event', href: '/dashboard/admin/events', icon: 'mdi:calendar-star', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Kelola Member', href: '/dashboard/admin/members', icon: 'mdi:account-group', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Kelola Partner', href: '/dashboard/admin/partners', icon: 'mdi:handshake', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Pesan Kontak', href: '/dashboard/admin/contacts', icon: 'mdi:email-outline', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Kelola Review', href: '/dashboard/admin/reviews', icon: 'mdi:star-outline', color: 'text-yellow-600', bg: 'bg-yellow-50' },
]

export default function DashboardAdminPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentRegistrations, setRecentRegistrations] = useState([])
  const [unreadContacts, setUnreadContacts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetchStats()
  }, [token])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const [eventsRes, membersRes, regRes, contactsRes] = await Promise.all([
        fetch('/api/admin/events?limit=1', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/members?limit=1', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/registrations?limit=5&sort_by=created_at&sort_order=desc', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/contacts?limit=20&status=new', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const [eventsData, membersData, regData, contactsData] = await Promise.all([
        eventsRes.ok ? eventsRes.json() : {},
        membersRes.ok ? membersRes.json() : {},
        regRes.ok ? regRes.json() : {},
        contactsRes.ok ? contactsRes.json() : {},
      ])

      setStats({
        totalEvents: eventsData?.data?.pagination?.total_items ?? '-',
        totalMembers: membersData?.data?.pagination?.total_items ?? '-',
        totalRegistrations: regData?.data?.pagination?.total_items ?? '-',
      })
      setRecentRegistrations(regData?.data?.items || [])
      setUnreadContacts(contactsData?.data?.pagination?.total_items ?? 0)
    } catch (err) {
      console.error('Admin dashboard fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Event', value: stats?.totalEvents, icon: 'mdi:calendar-star', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Member', value: stats?.totalMembers, icon: 'mdi:account-group', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Registrasi', value: stats?.totalRegistrations, icon: 'mdi:ticket-confirmation', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pesan Belum Dibaca', value: unreadContacts, icon: 'mdi:email-alert-outline', color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1 text-sm">Ringkasan aktivitas platform Runminders</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color} font-variant-numeric-tabular`}>
                    {isLoading ? (
                      <span className="inline-block w-8 h-6 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon icon={card.icon} className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Aksi Cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-white transition-colors"
              >
                <div className={`w-9 h-9 rounded-lg ${link.bg} flex items-center justify-center shrink-0`}>
                  <Icon icon={link.icon} className={`w-5 h-5 ${link.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 leading-tight">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        {recentRegistrations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Registrasi Terbaru</h2>
              <Link href="/dashboard/admin/registrations" className="text-xs text-primary hover:underline">
                Lihat semua
              </Link>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Peserta</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{reg.participant_full_name || '-'}</p>
                          <p className="text-xs text-gray-500">{reg.registration_number}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
                          {reg.event?.title || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                            reg.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : reg.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {reg.payment_status === 'paid' ? 'Lunas' : reg.payment_status === 'pending' ? 'Menunggu' : reg.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
