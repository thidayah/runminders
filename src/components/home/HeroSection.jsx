'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from "next/link"

// /* Medium Promo Banners */
// - Desktop: 800 x 400 px (2:1 ratio)
// - Mobile: 350 x 200 px (16:9 ratio)

const promoSlides = [
  {
    id: 1,
    title: "Jakarta International Marathon",
    description: "Event lari terbesar se-Asia Tenggara dengan rute ikonik ibu kota",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=400&fit=crop",
    badge: "Coming Soon",
    date: "15 Desember 2024",
    banner: {
      stats: "2.5K+ Peserta",
    }
  },
  {
    id: 2,
    title: "Virtual Run Series",
    description: "Ikuti challenge virtual dan dapatkan medali eksklusif langsung ke rumahmu",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    badge: "Trending",
    date: "Setiap Bulan",
    banner: {
      stats: "5K+ Virtual Runs",
    }
  },
  {
    id: 3,
    title: "Trail Running Adventure",
    description: "Petualangan trail running melalui jalur hijau terindah di Indonesia",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    badge: "New",
    date: "20 Januari 2025",
    banner: {
      stats: "800+ Adventurers",
    }
  },
  {
    id: 4,
    title: "Charity Run for Education",
    description: "Setiap langkahmu menyumbang untuk pendidikan anak Indonesia",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=400&fit=crop",
    badge: "Charity",
    date: "10 Februari 2025",
    banner: {
      stats: "1K+ Donors",
    }
  },
  {
    id: 5,
    title: "Sunrise 5K Fun Run",
    description: "Lari santai menyambut matahari terbit di pagi hari yang cerah",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    badge: "Family",
    date: "8 Maret 2025",
    banner: {
      stats: "3K+ Families",
    }
  },
  {
    id: 6,
    title: "Midnight Marathon",
    description: "Pengalaman unik lari marathon di malam hari dengan pencahayaan spesial",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop",
    badge: "Exclusive",
    date: "25 Juli 2025",
    banner: {
      stats: "Limited 500 Slots",
    }
  },
  {
    id: 7,
    title: "Beach Run Challenge",
    description: "Challenge yourself dengan lari di medan berpasir dengan pemandangan laut",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop",
    badge: "Challenge",
    date: "12 Agustus 2025",
    banner: {
      stats: "1.2K Challengers",
    }
  }
]

const handleSmoothScroll = (href) => {
  const targetId = href.substring(1)
  const targetElement = document.getElementById(targetId)

  if (targetElement) {
    const headerHeight = 50 // Height of sticky header
    const targetPosition = targetElement.offsetTop - headerHeight

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }

  // Close mobile menu after click
  // setIsMenuOpen(false)
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
    }, 5000) // Ganti slide setiap 5 detik
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-neutral-dark z-0"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-center">
            {/* <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="w-2 h-2 bg-accent rounded-full animate-ping"></span>
              <span className="text-white/90 text-sm font-medium">Platform Event Lari Terbaru di Indonesia</span>
            </div> */}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Temukan Passion
              <span className=" block">Berlari<span className="text-accent"> Bersama Kami</span> </span>
            </h1>

            <div className=" flex justify-center">
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-5xl">
                Dari pemula yang baru memulai perjalanan lari hingga atlet marathon berpengalaman.
                Bergabunglah dengan <span className="text-accent font-semibold">100+ pelari</span> dalam
                petualangan tak terlupakan menuju finish line impianmu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-center">
              <Link href={'/events'} className=" font-medium bg-white py-2 px-5 rounded-full border border-white hover:bg-transparent hover:text-white cursor-pointer transition">
                Jelajahi Events
              </Link>
            </div>

            {/* Stats */}
            <div className=" flex justify-center">
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">10+</div>
                  <div className="text-white/70 text-sm">Event Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">100+</div>
                  <div className="text-white/70 text-sm">Pelari Bergabung</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">5+</div>
                  <div className="text-white/70 text-sm">Kota di Indonesia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Promo Slider */}
          <div className="relative hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-1 border border-white/20 shadow-2xl">
              {/* Main Promo Card */}
              <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 relative overflow-hidden">

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
                    {promoSlides[currentSlide].title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {promoSlides[currentSlide].description}
                  </p>
                  <div className="text-sm text-gray-500 mb-2">
                    👥 {promoSlides[currentSlide].banner.stats}
                  </div>
                  <div className="text-sm text-gray-500">
                    📅 {promoSlides[currentSlide].date}
                  </div>
                </div>

                {/* Image Banner dengan Real Images */}
                <div className="relative rounded-2xl overflow-hidden mb-6 group transition-all duration-500">
                  {/* Main Banner Container dengan Background Image */}
                  <div
                    className="w-full aspect-[2/1] md:aspect-[2/1] relative overflow-hidden bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${promoSlides[currentSlide].bannerImage})`
                    }}
                  >
                    {/* Overlay untuk readability */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Badge */}
                    <div className={` absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-bold text-white backdrop-blur-sm bg-accent`}>
                      {promoSlides[currentSlide].badge}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button variant="primary" size="md" fullWidth>
                  Daftar Sekarang
                </Button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              →
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {promoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                    ? 'bg-white'
                    : 'bg-white/30 hover:bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button onClick={() => handleSmoothScroll('#events')} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
        <div className="text-white/70 text-sm">Scroll untuk explore</div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto mt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full mx-auto mt-2 animate-pulse"></div>
        </div>
      </button>
    </section>
  )
}