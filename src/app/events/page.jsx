'use client'

import { useState, useEffect } from 'react'
import EventList from '@/components/events/EventList'
import Layout from "@/components/layout/Layout"

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: "Jakarta International Marathon 2024",
    location: "Gelora Bung Karno, Jakarta",
    date: "15 Des 2024",
    participants: "2.5k",
    price: 250000,
    type: "marathon",
    badge: "Coming Soon",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop",
    categories: ["Marathon", "City Run"],
    difficulty: "Expert",
    organizer: "Jakarta Running Foundation",
    earlyBird: true,
    earlyBirdPrice: 200000
  },
  {
    id: 2,
    title: "Virtual Run Challenge - Monthly Series",
    location: "Online - Dimana Saja",
    date: "Setiap Bulan",
    participants: "5.2k",
    price: 75000,
    type: "virtual",
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    categories: ["Virtual", "All Levels"],
    difficulty: "Beginner",
    organizer: "RunVirtual Indonesia",
    earlyBird: false
  },
  {
    id: 3,
    title: "Bali Trail Running Adventure",
    location: "Ubud, Bali",
    date: "20 Jan 2025",
    participants: "800",
    price: 350000,
    type: "trail",
    badge: "New",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop",
    categories: ["Trail", "Adventure"],
    difficulty: "Intermediate",
    organizer: "Bali Trail Runners",
    earlyBird: true,
    earlyBirdPrice: 300000
  },
  {
    id: 4,
    title: "Charity Run for Education 2025",
    location: "Surabaya City Center",
    date: "10 Feb 2025",
    participants: "1.2k",
    price: 150000,
    type: "charity",
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop",
    categories: ["Charity", "Community"],
    difficulty: "Beginner",
    organizer: "Surabaya Care Foundation",
    earlyBird: false
  },
  {
    id: 5,
    title: "Sunrise 5K Family Fun Run",
    location: "Ancol Beach, Jakarta",
    date: "8 Mar 2025",
    participants: "3.1k",
    price: 120000,
    type: "funrun",
    badge: "Family",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
    categories: ["Fun Run", "Family"],
    difficulty: "Beginner",
    organizer: "Jakarta Family Runners",
    earlyBird: true,
    earlyBirdPrice: 100000
  },
  {
    id: 6,
    title: "Midnight Half Marathon",
    location: "Sudirman Central Business District",
    date: "25 Jul 2025",
    participants: "1.8k",
    price: 200000,
    type: "marathon",
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=400&fit=crop",
    categories: ["Marathon", "Night Run"],
    difficulty: "Intermediate",
    organizer: "Night Runners Jakarta",
    earlyBird: false
  },
  {
    id: 7,
    title: "Bandung Highland Trail Run",
    location: "Lembang, Bandung",
    date: "5 Apr 2025",
    participants: "600",
    price: 275000,
    type: "trail",
    badge: "Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    categories: ["Trail", "Mountain"],
    difficulty: "Expert",
    organizer: "Bandung Adventure Club",
    earlyBird: true,
    earlyBirdPrice: 250000
  },
  {
    id: 8,
    title: "Surabaya City Run 10K",
    location: "Tunjungan Plaza, Surabaya",
    date: "18 Mei 2025",
    participants: "1.5k",
    price: 180000,
    type: "marathon",
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1544830751-9c4cdf187e4c?w=400&h=400&fit=crop",
    categories: ["City Run", "10K"],
    difficulty: "Intermediate",
    organizer: "Surabaya Runners Community",
    earlyBird: false
  }
]

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   // Simulate API call
  //   setTimeout(() => {
  //     setEvents(sampleEvents)
  //     setLoading(false)
  //   }, 1000)
  // }, [])

   useEffect(() => {
    // Load data immediately on component mount
    const loadEvents = async () => {
      try {
        // Simulate API call dengan delay lebih pendek
        setTimeout(() => {
          setEvents(sampleEvents)
          setLoading(false)
        }, 500) // Reduced from 1000ms to 500ms
      } catch (error) {
        console.error('Error loading events:', error)
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br bg-primary via-primary to-white">
          {/* Background Gradient */}
          <div className="h-96 bg-cover bg-center" >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 mt-16">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-light mb-6">
                  Temukan Event Lari Terbaik
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Jelajahi berbagai event lari dari seluruh Indonesia. Dari marathon hingga fun run,
                  temukan yang sesuai dengan level dan preferensimu.
                </p>
              </div>              
            </div>
          </div>
        </div>
        <EventList events={events} loading={loading} />
      </div>
    </Layout>
  )
}