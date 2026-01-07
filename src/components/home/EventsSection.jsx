'use client'

import { useState, useEffect } from 'react'
import EventCard from '@/components/ui/EventCard'
import Button from "@/components/ui/Button"
import Link from "next/link"
import { Icon } from '@iconify/react'

export default function EventsSection() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch only active events, limit to 9
      const response = await fetch('/api/events?page=1&limit=9&status=active')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      
      const result = await response.json()
      
      if (result.success) {
        setEvents(result.data.items || [])
      } else {
        throw new Error(result.message || 'Failed to load events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-4">
          Event Terkini
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Temukan event lari terbaik yang sedang trending di komunitas pelari Indonesia
        </p>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="text-primary hover:text-primary/80 font-medium flex items-center justify-center mx-auto"
            >
              <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <EventCard key={index} loading={true} />
            ))
          ) : events.length === 0 ? (
            // Empty state
            <div className="col-span-4 text-center py-12">
              <Icon icon="mdi:calendar-blank" className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-gray-600">Belum ada event yang tersedia</p>
            </div>
          ) : (
            // Events list
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>

        {/* View All Button - Only show if we have events */}
        {events.length > 0 && (
          <div className="text-center mt-12">
            <Link href={'/events'}>
              <Button variant="outline" size="md">
                Lihat Semua Event ({events.length}+)
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}