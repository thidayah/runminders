'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useAuth } from '@/hooks/useAuth'
import Header from './Header'
import Footer from './Footer'

// Menu untuk user biasa (member)
const memberMenu = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'mdi:view-dashboard',
    exact: true
  },
  {
    title: 'Profil',
    href: '/dashboard/profile',
    icon: 'mdi:account',
    exact: false
  },
  {
    title: 'Event Saya',
    href: '/dashboard/my-events',
    icon: 'mdi:ticket',
    exact: false
  }
]

// Menu untuk admin
const adminMenu = [
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: 'mdi:view-dashboard',
    exact: true
  },
  {
    title: 'Profil',
    href: '/dashboard/admin/profile',
    icon: 'mdi:account',
    exact: false
  },
  {
    title: 'Event',
    href: '/dashboard/admin/events',
    icon: 'mdi:calendar-star',
    exact: false
  },
  {
    title: 'Partner',
    href: '/dashboard/admin/partners',
    icon: 'mdi:handshake',
    exact: false
  }
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  
  // Tentukan menu berdasarkan role
  const dashboardMenu = user?.role === 'admin' ? adminMenu : memberMenu

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user && pathname.startsWith('/dashboard')) {
      router.push('/login')
    }

    // Redirect admin to admin dashboard if accessing member dashboard
    if (user?.role === 'admin' && pathname === '/dashboard') {
      router.push('/dashboard/admin')
    }

    // Redirect member to member dashboard if accessing admin routes
    if (user?.role === 'member' && pathname.startsWith('/dashboard/admin')) {
      router.push('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isActive = (menuItem) => {
    if (menuItem.exact) {
      return pathname === menuItem.href
    }
    return pathname.startsWith(menuItem.href)
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <Header />

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-20 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Icon icon={sidebarOpen ? 'mdi:close' : 'mdi:menu'} className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="pt-16 md:pt-20 container mx-auto">
        <div className="flex ">
          <div>
            {/* Sidebar */}
            <aside
              // className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
              className={` rounded-lg stroke-indigo-50 md:sticky top-28 mb-6 left-0 w-64 bg-white border border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
              {/* User Profile Card */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {/* <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user?.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div> */}
                  <div className="flex-1 min-w-0">
                    {/* <h3 className="font-semibold text-gray-900 truncate">
                      {user?.full_name || 'Member'}
                    </h3> */}
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user?.full_name?.split(' ')[0] || 'Member'}
                      </h3>
                      {user?.is_email_verified && (
                        <span className="flex items-center text-green-600 text-xs ml-1">
                          <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                          Terverifikasi
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                    {/* <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {user?.role === 'member' ? 'Member' : user?.role}
                    </span> */}
                    {/* Role Badge */}
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center mt-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        <Icon icon="mdi:shield-account" className="w-3 h-3 mr-1" />
                        Administrator
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {dashboardMenu.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => isMobile && setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                      >
                        <Icon icon={item.icon} className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                        {isActive(item) && (
                          <span className="ml-auto">
                            <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}

                  {/* Logout Button */}
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

                {/* Quick Stats (Optional) */}
                {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status Akun</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Verifikasi Email</span>
                    {user?.is_email_verified ? (
                      <span className="flex items-center text-green-600">
                        <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <Icon icon="mdi:alert-circle" className="w-4 h-4 mr-1" />
                        Belum
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member Sejak</span>
                    <span className="text-gray-900">
                      {new Date(user?.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>
              </div> */}
              </nav>
            </aside>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6">
            <div className="max-w-7xl mx-auto mt-2">
              {/* Breadcrumb */}
              <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-gray-600">
                  <li>
                    <Link 
                      href={user?.role === 'admin' ? '/dashboard/admin' : '/dashboard'} 
                      className="hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  {pathname !== (user?.role === 'admin' ? '/dashboard/admin' : '/dashboard') && (
                    <>
                      <li>
                        <Icon icon="mdi:chevron-right" className="w-4 h-4" />
                      </li>
                      <li className="text-gray-900 font-medium">
                        {dashboardMenu.find(item => isActive(item))?.title || 'Page'}
                      </li>
                    </>
                  )}
                </ol>
              </nav>

              {/* Page Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}