'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from "next/link"

const navigation = [
  { name: 'Beranda', href: '#home' },
  { name: 'Tentang', href: '#about' },
  { name: 'Event', href: '#events' },
  { name: 'Partner', href: '#partners' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    // if (['/login', '/register'].includes(pathname)) {
    //   setIsScrolled(true)
    //   // return false
    // }
    const handleScroll = () => {
      // Background change on scroll
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Active section detection
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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSmoothScroll = (href) => {
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const headerHeight = 30 // Height of sticky header
      const targetPosition = targetElement.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }

    // Close mobile menu after click
    // setIsMenuOpen(false)
  }

  return (
    <header className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm'
        : 'bg-transparent'
      }
    `}>
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Logo dengan smooth scroll ke home */}
          <button
            onClick={() => handleSmoothScroll('#home')}
            className={`
              text-2xl font-bold transition duration-300 hover:scale-105 transform cursor-pointer
              ${isScrolled ? 'text-primary' : 'text-white'}
            `}
          >
            RUNminders
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSmoothScroll(item.href)}
                className={`
                  relative transition-all duration-300 font-medium py-2 cursor-pointer
                  ${isScrolled
                    ? activeSection === item.href.substring(1)
                      ? 'text-primary'
                      : 'text-neutral-800 hover:text-primary'
                    : activeSection === item.href.substring(1)
                      ? 'text-white font-semibold'
                      : 'text-white/90 hover:text-white'
                  }
                `}
              >
                {item.name}
                {/* Active Indicator */}
                {activeSection === item.href.substring(1) && (
                  <span className={`
                    absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-all duration-300
                    ${isScrolled ? 'bg-primary' : 'bg-white'}
                  `}></span>
                )}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={'/login'}>
              <Button
                variant={isScrolled ? "outline" : "white-outline"}
                size="sm"
              >
                Masuk
              </Button>
            </Link>
            <Link href={'/register'}>
              <Button
                variant={isScrolled ? "primary" : "white"}
                size="sm"
              >
                Registrasi
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`
                w-full h-0.5 transition-all duration-300
                ${isScrolled ? 'bg-neutral-800' : 'bg-white'}
              `}></div>
              <div className={`
                w-full h-0.5 transition-all duration-300
                ${isScrolled ? 'bg-neutral-800' : 'bg-white'}
              `}></div>
              <div className={`
                w-full h-0.5 transition-all duration-300
                ${isScrolled ? 'bg-neutral-800' : 'bg-white'}
              `}></div>
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`
            md:hidden py-4 border-t transition-all duration-300
            ${isScrolled
              ? 'bg-white/95 backdrop-blur-md border-gray-200'
              : 'bg-black/20 backdrop-blur-md border-white/20'
            }
          `}>
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSmoothScroll(item.href)}
                  className={`
                    text-left transition-all duration-300 font-medium py-2 px-2 rounded-lg
                    ${isScrolled
                      ? activeSection === item.href.substring(1)
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-neutral-800 hover:text-primary hover:bg-gray-100'
                      : activeSection === item.href.substring(1)
                        ? 'bg-white/20 text-white border-l-4 border-white'
                        : 'text-white hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
              <div className="flex space-x-4 pt-4">
                <Button
                  variant={isScrolled ? "outline" : "white-outline"}
                  size="sm"
                  fullWidth
                >
                  Login
                </Button>
                <Button
                  variant={isScrolled ? "primary" : "white"}
                  size="sm"
                  fullWidth
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