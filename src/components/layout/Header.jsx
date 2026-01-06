'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { Icon } from '@iconify/react'
import { signOut } from "next-auth/react"

const navigation = [
  { name: 'Beranda', href: '#home' },
  { name: 'Tentang', href: '#about' },
  { name: 'Event', href: '#events' },
  { name: 'Partner', href: '#partners' },
]

const transparentHeaderPages = ['/', '/events', '/events/[id]', '/about', '/faq']
const solidHeaderPages = ['/login', '/register', '/privacy-policy', '/terms-conditions', '/about']

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const pathname = usePathname()
  const router = useRouter()
  const dropdownRef = useRef(null)

  // Get authentication state
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  // Cek apakah halaman saat ini termasuk yang header-nya transparan
  const isTransparentPage = transparentHeaderPages.some(page => {
    if (page.includes('[id]')) {
      return pathname.startsWith('/events/') && pathname !== '/events'
    }
    return pathname === page
  })

  // Cek apakah halaman saat ini termasuk yang header-nya solid
  const isSolidPage = solidHeaderPages.includes(pathname)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Tentukan style header berdasarkan halaman dan scroll
  const getHeaderStyle = () => {
    // Jika di halaman solid, selalu solid
    if (isSolidPage) {
      return 'bg-white shadow-sm'
    }

    // Jika di halaman transparan, tergantung scroll
    if (isTransparentPage) {
      return isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }

    // Default untuk halaman lainnya
    return 'bg-white shadow-sm'
  }

  // Tentukan text color berdasarkan halaman dan scroll
  const getTextColor = (isScrolledState = isScrolled) => {
    if (isSolidPage) {
      return 'text-neutral-800'
    }

    if (isTransparentPage) {
      return isScrolledState ? 'text-neutral-800' : 'text-white'
    }

    return 'text-neutral-800'
  }

  useEffect(() => {
    // Hanya aktifkan scroll detection untuk halaman transparan
    if (isTransparentPage) {
      const handleScroll = () => {
        // Background change on scroll
        if (window.scrollY > 50) {
          setIsScrolled(true)
        } else {
          setIsScrolled(false)
        }

        // Active section detection (hanya untuk homepage)
        if (pathname === '/') {
          const sections = navigation.map(item => item.href.substring(1))
          const current = sections.find(section => {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              return rect.top <= 100 && rect.bottom >= 100
            }
            return false
          })

          if (current) {
            setActiveSection(current)
          }
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    } else {
      // Reset scroll state untuk halaman non-transparan
      setIsScrolled(false)
    }
  }, [isTransparentPage, pathname])

  const handleSmoothScroll = (href) => {
    if (pathname === '/') {
      // Smooth scroll untuk homepage
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerHeight = 50
        const targetPosition = targetElement.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
      setIsMenuOpen(false)
    } else {
      // Navigate ke homepage dengan hash untuk halaman lainnya
      router.push(`/${href}`)
    }
  }

  const handleLogoClick = () => {
    if (pathname === '/') {
      // Scroll to top di homepage
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Navigate ke homepage
      router.push('/')
    }
  }

  const handleLogout = () => {    
    logout()
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
    if (user.provider_id) {
      signOut()
    }else{
      router.push('/login')
    }
  }

  // User dropdown menu items
  const userMenuItems = [
    {
      label: 'Dashboard',
      icon: 'mdi:view-dashboard',
      href: '/dashboard'
    },
    // {
    //   label: 'Profil Saya',
    //   icon: 'mdi:account',
    //   href: '/profile'
    // },
    {
      label: 'Event Saya',
      icon: 'mdi:ticket',
      href: '/my-events'
    },
    // {
    //   label: 'Pengaturan',
    //   icon: 'mdi:cog',
    //   href: '/settings',
    // },
    {
      label: 'Logout',
      icon: 'mdi:logout',
      className: 'text-red-600 hover:bg-red-50'
    }
  ]

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${getHeaderStyle()}`}>
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4 px-4">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className={`text-2xl font-bold transition duration-300 hover:scale-105 transform cursor-pointer ${getTextColor()}`}
          >
            Runminders
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSmoothScroll(item.href)}
                className={`relative transition-all duration-300 font-medium py-2 cursor-pointer ${pathname === '/' && activeSection === item.href.substring(1)
                  ? `${getTextColor()} font-semibold`
                  : `${getTextColor()} hover:${getTextColor() === 'text-white' ? 'text-white' : 'text-primary'}`
                  }`}
              >
                {item.name}
                {/* Active Indicator - hanya tampil di homepage */}
                {pathname === '/' && activeSection === item.href.substring(1) && (
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-all duration-300 ${getTextColor() === 'text-white' ? 'bg-white' : 'bg-primary'
                    }`}></span>
                )}
              </button>
            ))}
          </div>

          {/* Auth Buttons / User Dropdown */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoading ? (
              // Loading state
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              // User is logged in - Show user dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${getTextColor() === 'text-white' && !isScrolled
                    ? 'hover:bg-white/20'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user?.full_name || 'User'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className={`text-sm font-medium ${getTextColor() === 'text-white' && !isScrolled ? 'text-white' : 'text-white'
                          }`}>
                          {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium truncate max-w-[120px] ${getTextColor()}`}>
                        {user?.full_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className={`text-xs ${getTextColor() === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>
                        {user?.role || 'Member'}
                      </p>
                    </div>
                  </div>
                  <Icon
                    icon={isDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                    className={`w-5 h-5 transition-transform ${getTextColor()}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 ${getTextColor() === 'text-white' && !isScrolled
                    ? 'bg-black/20 backdrop-blur-md border border-white/20'
                    : 'bg-white border border-gray-200'
                    }`}>
                    {/* User Info */}
                    <div className={`px-4 py-3 border-b ${getTextColor() === 'text-white' && !isScrolled
                      ? 'border-white/20'
                      : 'border-gray-100'
                      }`}>
                      <p className={`text-sm font-semibold ${getTextColor() === 'text-white' && !isScrolled ? 'text-white' : 'text-gray-900'
                        }`}>
                        {user?.full_name || 'User'}
                      </p>
                      <p className={`text-xs mt-1 ${getTextColor() === 'text-white' && !isScrolled ? 'text-white/70' : 'text-gray-500'
                        }`}>
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (item.label === 'Logout') {
                            return handleLogout()
                          } else {
                            router.push(item.href)
                            setIsDropdownOpen(false)
                          }
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm transition-colors cursor-pointer ${getTextColor() === 'text-white' && !isScrolled
                          ? 'hover:bg-white/10 text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                          } ${item.className || ''}`}
                      >
                        <Icon icon={item.icon} className="w-5 h-5 mr-3" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - Show login/register buttons
              <>
                <Button
                  variant={getTextColor() === 'text-white' && !isScrolled ? "white-outline" : "outline"}
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Masuk
                </Button>
                <Button
                  variant={getTextColor() === 'text-white' && !isScrolled ? "white" : "primary"}
                  size="sm"
                  onClick={() => router.push('/register')}
                >
                  Registrasi
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon icon={`mdi:hamburger-${!isMenuOpen ? 'close' : 'open'}`} className={` size-8 transition-all duration-300 ${getTextColor()}`} />
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-all duration-300 px-4 ${isSolidPage || isScrolled
            ? 'bg-white border-gray-200'
            : 'bg-black/20 backdrop-blur-md border-white/20'
            }`}>
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className={`text-left transition-all duration-300 font-medium py-2 px-2 ${isSolidPage || isScrolled
                    ? pathname === '/' && activeSection === item.href.substring(1)
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'text-neutral-800 hover:text-primary hover:bg-gray-100'
                    : pathname === '/' && activeSection === item.href.substring(1)
                      ? 'bg-white/20 text-white border-l-4 border-white'
                      : 'text-white hover:text-white hover:bg-white/10'
                    }`}
                >
                  {item.name}
                </button>
              ))}

              {/* User Section in Mobile Menu */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 dark:border-white/20">
                  {/* User Info */}
                  <div className="flex items-center px-2 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user?.full_name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isSolidPage || isScrolled ? 'text-gray-900' : 'text-white'}`}>
                        {user?.full_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className={`text-sm ${isSolidPage || isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile User Menu Items */}
                  {userMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (item.label === 'Logout') {
                          return handleLogout()
                        } else {
                          router.push(item.href)
                          setIsMenuOpen(false)
                        }
                      }}
                      className={`flex items-center w-full text-left transition-all duration-300 font-medium py-3 px-2 rounded-lg cursor-pointer ${isSolidPage || isScrolled
                        ? 'text-neutral-800 hover:text-primary hover:bg-gray-100'
                        : 'text-white hover:text-white hover:bg-white/10'
                        } ${item.className || ''}`}
                    >
                      <Icon icon={item.icon} className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex space-x-4 pt-4">
                  <Button
                    variant={isSolidPage || isScrolled ? "outline" : "white-outline"}
                    size="sm"
                    fullWidth
                    onClick={() => {
                      router.push('/login')
                      setIsMenuOpen(false)
                    }}
                  >
                    Masuk
                  </Button>
                  <Button
                    variant={isSolidPage || isScrolled ? "primary" : "white"}
                    size="sm"
                    fullWidth
                    onClick={() => {
                      router.push('/register')
                      setIsMenuOpen(false)
                    }}
                  >
                    Registrasi
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}