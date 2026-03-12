'use client'

import Link from "next/link"
import { Icon } from "@iconify/react"
import Button from './Button'
import { useState, useEffect } from 'react'
import { formatCurrency, formatDate } from '@/lib/formatters-utils'
import { useRouter } from "next/navigation"

export default function EventCard({ event, loading = false }) {
  const router = useRouter()
  const [status, setStatus] = useState('available')
  const [statusText, setStatusText] = useState('Daftar')

  useEffect(() => {
    if (event) {
      // Check event status
      const now = new Date()
      const regOpen = event.registration_open_date ? new Date(event.registration_open_date) : null
      const regClose = event.registration_close_date ? new Date(event.registration_close_date) : null
      const eventDate = event.event_date ? new Date(event.event_date) : null

      // Check if event date has passed
      if (eventDate && eventDate < now) {
        setStatus('completed')
        setStatusText('Event Selesai')
        return
      }

      // Check if registration is closed
      if (regClose && regClose < now) {
        setStatus('closed')
        setStatusText('Pendaftaran Tutup')
        return
      }

      // Check if registration hasn't opened yet
      if (regOpen && regOpen > now) {
        setStatus('upcoming')
        setStatusText('Segera')
        return
      }

      // Check if event is full
      if (event.max_participants && event.current_participants >= event.max_participants) {
        setStatus('full')
        setStatusText('Kuota Penuh')
        return
      }

      // Check individual categories if all are full
      if (event.categories) {
        const allCategoriesFull = event.categories.every(cat =>
          cat.max_slots && cat.current_slots >= cat.max_slots
        )
        if (allCategoriesFull) {
          setStatus('full')
          setStatusText('Kuota Penuh')
          return
        }
      }

      // Default available
      setStatus('available')
      setStatusText('Daftar')
    }
  }, [event])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
        {/* Image Loading */}
        <div className="aspect-video bg-gray-200"></div>

        {/* Content Loading */}
        <div className="p-5 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) return null

  // Get earliest date from categories for early bird
  const hasEarlyBird = event.has_early_bird && event.early_bird_end_date &&
    new Date(event.early_bird_end_date) > new Date()

  // Get display price (lowest category price or base price)
  const getDisplayPrice = () => {
    if (event.is_free) return 0

    // // Get lowest category price
    // if (event.categories && event.categories.length > 0) {
    //   const activeCategories = event.categories.filter(cat => cat.is_active)
    //   if (activeCategories.length > 0) {
    //     const prices = activeCategories.map(cat => cat.price)
    //     return Math.min(...prices)
    //   }
    // }

    if (hasEarlyBird) {
      return event.early_bird_price || 0
    }

    // Fallback to base price
    return event.base_price || 0
  }

  // Get category name for display
  const getCategoryName = () => {
    if (!event.categories || event.categories.length === 0) return 'Single Category'

    const activeCategories = event.categories.filter(cat => cat.is_active)
    if (activeCategories.length === 1) {
      return activeCategories[0].name
    }

    return `${activeCategories.length} Kategori Tersedia`
  }

  const displayPrice = getDisplayPrice()
  const categoryName = getCategoryName()

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Event Image */}
      <Link href={`/events/${event.slug || event.id}`}>
        <div className="relative aspect-video overflow-hidden cursor-pointer">
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage: `url(${event.image_url || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=400&fit=crop'})`
            }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Badge/Status */}
          <div className="absolute top-3 left-3">
            {hasEarlyBird ? (
              <span className="px-3 py-2 rounded-full text-xs font-semibold text-white bg-red-500 backdrop-blur-sm">
                Early Bird
              </span>
            )
              // : status === 'full' ? (
              //   <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-red-500/90 backdrop-blur-sm">
              //     Kuota Penuh
              //   </span>
              // ) : status === 'closed' ? (
              //   <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-gray-500/90 backdrop-blur-sm">
              //     Tutup
              //   </span>
              // ) : status === 'completed' ? (
              //   <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-gray-600/90 backdrop-blur-sm">
              //     Selesai
              //   </span>
              // ) : status === 'upcoming' ? (
              //   <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-blue-500/90 backdrop-blur-sm">
              //     Segera
              //   </span>
              // ) : event.location_type === 'virtual' ? (
              //   <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-purple-500/90 backdrop-blur-sm">
              //     Virtual
              //   </span>
              // ) 
              : null}
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-primary px-4 py-2 rounded-full font-semibold text-sm shadow-lg cursor-pointer">
              Lihat Detail
            </button>
          </div>
        </div>
      </Link>

      {/* Event Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-neutral-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200 ">
          {event.title}
        </h3>

        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:map-marker" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {event.location || 'Lokasi belum ditentukan'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:calendar" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm">{formatDate(event.event_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:tag" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm line-clamp-1">{categoryName}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <Icon icon="mdi:clock-outline" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm">
              {event.location_type === 'virtual' ? 'Virtual • Fleksibel' :
               event.location_type === 'hybrid' ? 'Hybrid • Pilihan Lokasi' :
               'Offline • On-site'}
            </span>
          </div> */}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500 block">Mulai dari</span>
            <span className="text-2xl font-bold text-primary">
              {event.is_free ? (
                <span className="text-green-600">Gratis</span>
              ) : (
                // `Rp ${displayPrice.toLocaleString('id-ID')}`
                formatCurrency(displayPrice)
              )}
            </span>
            {hasEarlyBird &&
              <span className=" ml-2 text-xs text-gray-400  line-through">
                {/* Rp {event.base_price.toLocaleString('id-ID')} */}
                {formatCurrency(event.base_price)}
              </span>
            }
          </div>
          <Button
            size="sm"
            disabled={status !== 'available'}
            className={`group-hover:scale-105 transition-transform duration-200 ${status !== 'available' ? 'opacity-70 disabled:cursor-not-allowed disabled:scale-100' : ''
              }`}
            onClick={() => {
              if (status === 'available') {
                // window.location.href = `/events/${event.slug || event.id}/register`
                router.push(`/events/${event.slug || event.id}/register`)
              }
            }}
          >
            {statusText}
          </Button>
        </div>
      </div>
    </div>
  )
}