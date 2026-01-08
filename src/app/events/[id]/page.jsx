'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import EventDetail from '@/components/events/EventDetail'
import Layout from "@/components/layout/Layout"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default function EventDetailPage() {
  const params = useParams()
  const slug = params?.id

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!slug) {
          throw new Error('Slug tidak ditemukan')
        }

        // console.log('Fetching event dengan slug:', slug)

        const response = await fetch(`/api/events/slug/${slug}`)

        if (response.status === 404) {
          throw new Error('Event tidak ditemukan')
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          setEvent(result.data)
        } else {
          throw new Error(result.message || 'Data event tidak valid')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError(err.message || 'Terjadi kesalahan saat memuat event')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchEventData()
    } else {
      setLoading(false)
      setError('Slug tidak ditemukan')
    }
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-primary to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-100 mt-2">Memuat...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br bg-primary to-white">
          <div className="text-center flex justify-center flex-col items-center max-w-lg">
            <Icon icon="mdi:event-busy-outline" className="size-20 text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-6">
              {error || 'Event yang Anda cari tidak dapat ditemukan.'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={'/events'}>
                <Button variant="outline"  size="md">
                  Lihat Event Lainnya
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <EventDetail event={event} />
    </Layout>
  )
}