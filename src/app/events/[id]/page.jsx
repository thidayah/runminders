'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import EventDetail from '@/components/events/EventDetail'
import Layout from "@/components/layout/Layout"

// Sample data - nanti bisa dari API
const eventData = {
  id: 1,
  title: "Jakarta International Marathon 2024",
  subtitle: "Lari Menuju Finish Line Impian di Ibu Kota",
  description: "Jakarta International Marathon adalah event lari terbesar se-Asia Tenggara yang menyatukan ribuan pelari dari berbagai penjuru dunia. Dengan rute yang melewati landmark ikonik Jakarta, event ini menawarkan pengalaman lari yang tak terlupakan.",
  image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=600&fit=crop",
  gallery: [
    "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop"
  ],
  date: "15 Desember 2024",
  time: "05:00 WIB",
  location: "Gelora Bung Karno, Jakarta",
  address: "Jl. Lapangan Banteng Timur No.1, Jakarta Pusat",
  coordinates: { lat: -6.2186, lng: 106.8028 },
  categories1: ["Marathon", "City Run", "International"],
  difficulty: "Expert",
  participants: {
    registered: 1250,
    max: 5000,
    waiting: 45
  },
  price: 250000,
  earlyBirdPrice: 200000,
  earlyBirdEnd: "2024-11-30",
  categories: [
    {
      id: 1,
      name: "Marathon (42K)",
      price: 450000,
      slots: 2000,
      registered: 856,
      description: "Full marathon untuk pelari berpengalaman"
    },
    {
      id: 2,
      name: "Half Marathon (21K)",
      price: 300000,
      slots: 2000,
      registered: 1204,
      description: "Half marathon untuk intermediate runners"
    },
    {
      id: 3,
      name: "10K Run",
      price: 200000,
      slots: 800,
      registered: 650,
      description: "10K run untuk pemula dan fun runners"
    },
    {
      id: 4,
      name: "5K Fun Run",
      price: 150000,
      slots: 200,
      registered: 45,
      description: "5K run untuk keluarga dan komunitas"
    }
  ],
  organizer: {
    name: "Jakarta Running Foundation",
    logo: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=100&h=100&fit=crop",
    rating: 4.8,
    events: 25,
    contact: "info@jakartamarathon.id"
  },
  highlights: [
    "Medali finisher eksklusif",
    "Goodie bag premium",
    "Tim medis lengkap",
    "Foto gratis di spot-spot strategis",
    "Live music & entertainment",
    "Food festival di area finish"
  ],
  schedule: [
    {
      time: "03:00",
      activity: "Registrasi & Bag Drop dibuka"
    },
    {
      time: "04:30",
      activity: "Warm-up session"
    },
    {
      time: "05:00",
      activity: "Start Marathon (42K)"
    },
    {
      time: "05:30",
      activity: "Start Half Marathon (21K)"
    },
    {
      time: "06:00",
      activity: "Start 10K Run"
    },
    {
      time: "08:00",
      activity: "Awarding ceremony"
    }
  ],
  requirements: [
    "Kartu identitas asli (KTP/SIM/Paspor)",
    "Surat keterangan sehat dokter",
    "Asuransi kesehatan aktif",
    "Pakaian lari yang nyaman",
    "Sepatu lari yang sesuai"
  ],
  reviews: [
    {
      id: 1,
      user: "Andi Pratama",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 5,
      comment: "Event yang sangat terorganisir! Dari registrasi sampai finish semuanya smooth. Medali dan goodie bagnya keren banget!",
      date: "2024-01-15",
      category: "Marathon (42K)"
    },
    {
      id: 2,
      user: "Sarah Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
      rating: 4,
      comment: "Sebagai pemula, 10K run ini perfect! Support dari volunteer sangat membantu. Akan ikut lagi tahun depan!",
      date: "2024-01-10",
      category: "10K Run"
    }
  ]
}

export default function EventDetailPage() {
  const router = useRouter()
  // console.log({ router });

  // const { id } = params
  const id = 1
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvent(eventData)
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 mt-2">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Event tidak ditemukan</h2>
            <button
              onClick={() => router.push('/events')}
              className="text-primary hover:text-primary-dark"
            >
              Kembali ke daftar event
            </button>
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