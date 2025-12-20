import EventCard from '@/components/ui/EventCard'

export default function RelatedEvents({ currentEventId }) {
  // Sample related events data
  const relatedEvents = [
    {
      id: 2,
      title: "Surabaya City Run 2024",
      location: "Tunjungan Plaza, Surabaya",
      date: "20 Jan 2025",
      participants: "1.5k",
      price: 180000,
      type: "marathon",
      badge: "Popular",
      image: "https://images.unsplash.com/photo-1544830751-9c4cdf187e4c?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Bali Trail Running Adventure",
      location: "Ubud, Bali",
      date: "5 Feb 2025",
      participants: "800",
      price: 350000,
      type: "trail",
      badge: "Adventure",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Bandung Highland Trail Run",
      location: "Lembang, Bandung",
      date: "15 Mar 2025",
      participants: "600",
      price: 275000,
      type: "trail",
      badge: "New",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Yogyakarta Heritage Run",
      location: "Malioboro, Yogyakarta",
      date: "12 Apr 2025",
      participants: "900",
      price: 125000,
      type: "funrun",
      badge: "Cultural",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop"
    }
  ].filter(event => event.id !== currentEventId)

  if (relatedEvents.length === 0) return null

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Event Serupa Lainnya</h2>
        <button className="text-primary hover:text-primary-dark font-semibold">
          Lihat Semua →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {relatedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}