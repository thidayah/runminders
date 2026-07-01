'use client'

import Link from "next/link"

const handleSmoothScroll = (href) => {
  const targetId = href.substring(1)
  const targetElement = document.getElementById(targetId)

  if (targetElement) {
    const headerHeight = 50
    const targetPosition = targetElement.offsetTop - headerHeight
    window.scrollTo({ top: targetPosition, behavior: 'smooth' })
  }
}

// const EVENT_CATEGORIES = ['Trail Run', 'Fun Run', 'Marathon', 'Virtual Run']

export default function HeroSection({ waUrl }) {
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
        <div className="grid grid-cols-1 gap-12 items-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Bikin event lari
              <span className="block">atau<span className="text-accent"> ikut event lari?</span></span>
            </h1>

            <div className="flex justify-center">
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-5xl">
                Platform siap pakai untuk terima pendaftaran dan pembayaran event larimu secara otomatis.
                Atau temukan dan daftar event lari di kotamu — semuanya dalam satu tempat.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={`${waUrl}?text=${encodeURIComponent('Halo, saya ingin tahu lebih lanjut soal daftarkan event lari di Runminders')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold bg-accent text-neutral-900 py-3 px-7 rounded-full hover:bg-accent/90 cursor-pointer transition text-base"
              >
                Daftarkan Eventmu
              </a>
              <Link
                href="/events"
                className="font-medium border border-white text-white py-2.5 px-6 rounded-full hover:bg-white hover:text-neutral-900 cursor-pointer transition text-sm"
              >
                Jelajahi Events
              </Link>
            </div>

            {/* Pill kategori — shortcut filter ke /events */}
            {/* <div className="flex justify-center mt-5">
              <div className="flex flex-wrap justify-center gap-2">
                {EVENT_CATEGORIES.map((kategori) => (
                  <Link
                    key={kategori}
                    href={`/events?category=${encodeURIComponent(kategori)}`}
                    className="px-3.5 py-1.5 bg-white/10 border border-white/20 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm hover:bg-white/20 hover:text-white transition"
                  >
                    {kategori}
                  </Link>
                ))}
              </div>
            </div> */}
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
