'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

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
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const pathname = usePathname()
  const router = useRouter()

  // Cek apakah halaman saat ini termasuk yang header-nya transparan
  const isTransparentPage = transparentHeaderPages.some(page => {
    if (page.includes('[id]')) {
      return pathname.startsWith('/events/') && pathname !== '/events'
    }
    return pathname === page
  })

  // Cek apakah halaman saat ini termasuk yang header-nya solid
  const isSolidPage = solidHeaderPages.includes(pathname)

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

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${getHeaderStyle()}`}>
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className={`text-2xl font-bold transition duration-300 hover:scale-105 transform cursor-pointer ${getTextColor()}`}
          >
            RUNminders
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSmoothScroll(item.href)}
                className={`relative transition-all duration-300 font-medium py-2 cursor-pointer ${
                  pathname === '/' && activeSection === item.href.substring(1)
                    ? `${getTextColor()} font-semibold`
                    : `${getTextColor()} hover:${getTextColor() === 'text-white' ? 'text-white' : 'text-primary'}`
                }`}
              >
                {item.name}
                {/* Active Indicator - hanya tampil di homepage */}
                {pathname === '/' && activeSection === item.href.substring(1) && (
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-all duration-300 ${
                    getTextColor() === 'text-white' ? 'bg-white' : 'bg-primary'
                  }`}></span>
                )}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
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
              Daftar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`w-full h-0.5 transition-all duration-300 ${getTextColor()}`}></div>
              <div className={`w-full h-0.5 transition-all duration-300 ${getTextColor()}`}></div>
              <div className={`w-full h-0.5 transition-all duration-300 ${getTextColor()}`}></div>
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-all duration-300 ${
            isSolidPage || isScrolled 
              ? 'bg-white border-gray-200' 
              : 'bg-black/20 backdrop-blur-md border-white/20'
          }`}>
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className={`text-left transition-all duration-300 font-medium py-2 px-2 rounded-lg ${
                    isSolidPage || isScrolled
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
                  Login
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
                  Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}