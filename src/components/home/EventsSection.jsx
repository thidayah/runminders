import EventCard from '@/components/ui/EventCard'
import Button from "@/components/ui/Button"
import Link from "next/link"

const data = [
  {
    id: 1,
    title: "Jakarta International Marathon 2024",
    location: "Gelora Bung Karno, Jakarta",
    date: "15 Des 2024",
    participants: "2.5k",
    price: 250000,
    type: "marathon",
    badge: "Coming Soon",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop", // City marathon
    bannerImage: "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", // Fitness tech
    bannerImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop", // Trail running
    bannerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop", // Community event
    bannerImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop", // Sunrise run
    bannerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=400&fit=crop", // Night run
    bannerImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", // Mountain trail
    bannerImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop"
  },
  {
    id: 9,
    title: "Yogyakarta Heritage Run",
    location: "Malioboro, Yogyakarta",
    date: "12 Jun 2025",
    participants: "900",
    price: 125000,
    type: "funrun",
    badge: "Cultural",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop", // Cultural run
    bannerImage: "https://images.unsplash.com/photo-1544830751-9c4cdf187e4c?w=800&h=400&fit=crop"
  }
]

export default function EventsSection() {
  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-4">
          Event Terpopuler
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Temukan event lari terbaik yang sedang trending di komunitas pelari Indonesia
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href={'/events'}>
            <Button variant="outline" size="md">
              Lihat Semua Event ({data.length}+)
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}