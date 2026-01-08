'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Icon } from '@iconify/react'

export default function PartnersSection() {
  const [partners, setPartners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPartners = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/partners?page=${1}&limit=${12}&status=active`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch partners')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setPartners(result.data.items || [])
        // setPartners([])
      } else {
        throw new Error(result.message || 'Failed to load partners')
      }
    } catch (err) {
      console.error('Error fetching partners:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const handlePartnerClick = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener noreferrer')
    }
  }

  return (
    <section id="partners" className="pt-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Partner Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berkolaborasi dengan brand ternama dan event organizer terpercaya untuk menghadirkan pengalaman lari terbaik
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 gap-y-12 items-center justify-center">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPartners()}
              className="text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
            >
              <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
              Coba Lagi
            </button>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="mdi:account-group-outline" className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-gray-600">Belum ada partner yang terdaftar</p>
          </div>
        ) : (
          <>
            {/* Partners Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 gap-y-12 items-center justify-center">
              {partners.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => handlePartnerClick(partner.website)}
                  disabled={!partner.website}
                  className="flex items-center justify-center transition-all duration-300 hover:scale-110 group justify-center bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-2"
                  title={partner.website ? `Visit ${partner.name}` : `${partner.name} (No website)`}
                >
                  <div className="text-center">
                    {/* Logo Container */}
                    <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-lg  p-4 transition-colors duration-300">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={`${partner.name} logo`}
                          className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
                          onError={(e) => {
                            // Fallback jika gambar error
                            e.target.style.display = 'none'
                            const fallback = e.target.parentElement.querySelector('.partner-fallback')
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback initial letter */}
                      <div
                        className="partner-fallback w-full h-full bg-gradient-to-br from-primary to-accent rounded-full hidden items-center justify-center text-white font-bold text-xl"
                      >
                        {partner.name.charAt(0)}
                      </div>
                    </div>
                    
                    {/* Partner Name */}
                    {/* <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                      {partner.name}
                    </p> */}
                    
                    {/* Website indicator */}
                    {!partner.website && (
                      <p className="text-xs text-gray-400 mt-1">No website</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* No Partners Message */}
            {partners.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Icon icon="mdi:account-group-outline" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Belum ada partner yang terdaftar</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Partnership CTA */}
      <div className="text-center mt-16 p-8 md:p-12 bg-gradient-to-br from-primary via-primary-dark to-neutral-dark text-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Jadi Partner Runminders?
          </h3>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            {/* Bergabunglah dengan jaringan partner kami dan jangkau ribuan pelari aktif di seluruh Indonesia */}
            Bergabunglah dengan jaringan partner kami dan jangkau ratusan pelari aktif
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={'/contact'}
              className="inline-flex items-center justify-center bg-white text-primary px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg cursor-pointer"
            >
              Jadi Event Organizer
            </Link>
            <Link
              href={'/contact'}
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-all shadow-lg cursor-pointer duration-300"
            >
              Jadi Sponsor
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}