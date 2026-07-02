'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useAuth } from '@/hooks/useAuth'
import Header from './Header'

const memberMenu = [
  { title: 'Dashboard', href: '/dashboard', icon: 'mdi:view-dashboard', exact: true },
  { title: 'Profil', href: '/dashboard/profile', icon: 'mdi:account', exact: false },
  { title: 'Event Saya', href: '/dashboard/my-events', icon: 'mdi:ticket', exact: false }
]

const adminMenu = [
  { title: 'Dashboard', href: '/dashboard/admin', icon: 'mdi:view-dashboard', exact: true },
  { title: 'Profil', href: '/dashboard/admin/profile', icon: 'mdi:account', exact: false },
  { title: 'Member', href: '/dashboard/admin/members', icon: 'mdi:account-group', exact: false },
  { title: 'Event', href: '/dashboard/admin/events', icon: 'mdi:calendar-star', exact: false },
  { title: 'Partner', href: '/dashboard/admin/partners', icon: 'mdi:handshake', exact: false },
  { title: 'Review', href: '/dashboard/admin/reviews', icon: 'mdi:star-outline', exact: false },
  { title: 'Kontak', href: '/dashboard/admin/contacts', icon: 'mdi:email-outline', exact: false }
]

const SEGMENT_LABELS = {
  events: 'Event',
  members: 'Member',
  partners: 'Partner',
  contacts: 'Kontak',
  reviews: 'Review',
  profile: 'Profil',
  'my-events': 'Event Saya',
  create: 'Tambah Baru',
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function buildBreadcrumb(pathname, isAdmin) {
  const basePath = isAdmin ? '/dashboard/admin' : '/dashboard'
  if (pathname === basePath) return []

  const relative = pathname
    .replace('/dashboard/admin', '')
    .replace('/dashboard', '')
  const segments = relative.split('/').filter(Boolean)

  const crumbs = []
  let accPath = basePath
  for (const seg of segments) {
    accPath = `${accPath}/${seg}`
    const label = UUID_RE.test(seg)
      ? 'Detail'
      : (SEGMENT_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1))
    crumbs.push({ label, href: accPath })
  }
  return crumbs
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  const dashboardMenu = user?.role === 'admin' ? adminMenu : memberMenu
  const isAdmin = user?.role === 'admin'
  const breadcrumbs = buildBreadcrumb(pathname, isAdmin)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isLoading && !user && pathname.startsWith('/dashboard')) {
      router.push('/login')
    }
    if (user?.role === 'admin' && pathname === '/dashboard') {
      router.push('/dashboard/admin')
    }
    if (user?.role === 'member' && pathname.startsWith('/dashboard/admin')) {
      router.push('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isActive = (menuItem) =>
    menuItem.exact ? pathname === menuItem.href : pathname.startsWith(menuItem.href)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Backdrop overlay — mobile only */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="pt-16 md:pt-20 flex">
        {/* Sidebar — fixed overlay on mobile, sticky on desktop */}
        <aside
          className={`
            fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 overflow-y-auto
            shadow-xl transition-transform duration-300
            md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:shadow-none md:border md:border-gray-200
            md:rounded-lg md:mb-6 md:self-start md:shrink-0 md:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user?.full_name?.split(' ')[0] || 'Member'}
                  </h3>
                  {user?.is_email_verified && (
                    <span className="flex items-center text-green-600 text-xs">
                      <Icon icon="mdi:check-circle" className="w-3.5 h-3.5 mr-0.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                {user?.role === 'admin' && (
                  <span className="inline-flex items-center mt-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    <Icon icon="mdi:shield-account" className="w-3 h-3 mr-1" />
                    Administrator
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-1">
              {dashboardMenu.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon icon={item.icon} className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                    {isActive(item) && (
                      <Icon icon="mdi:chevron-right" className="w-5 h-5 ml-auto" />
                    )}
                  </Link>
                </li>
              ))}

              <li className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Icon icon="mdi:logout" className="w-5 h-5" />
                  <span className="font-medium">Keluar</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-4rem)] p-4 md:p-6">
          <div className="max-w-7xl mx-auto mt-2">
            {/* Breadcrumb row — hamburger visible on mobile */}
            <nav className="mb-6 flex items-center gap-3">
              <button
                className="md:hidden p-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                <Icon icon={sidebarOpen ? 'mdi:close' : 'mdi:menu'} className="w-5 h-5" />
              </button>

              <ol className="flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
                <li className="shrink-0">
                  <Link
                    href={isAdmin ? '/dashboard/admin' : '/dashboard'}
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                    <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
                    {i === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-gray-900 truncate">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-primary transition-colors truncate">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Page content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
