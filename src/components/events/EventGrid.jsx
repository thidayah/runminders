import EventCard from '@/components/ui/EventCard'
import { Icon } from "@iconify/react"

export default function EventGrid({ events, loading, viewMode }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <EventCard key={index} loading={true} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 flex justify-center items-center flex-col">
        <Icon icon="mdi:search" className=" size-20" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Event tidak ditemukan</h3>
        <p className="text-gray-600 mb-6">
          Coba ubah filter pencarian Anda atau lihat semua event yang tersedia.
        </p>
      </div>
    )
  }

  return (
    <div className={
      viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        : "space-y-6"
    }>
      {events.map((event) => (
        <EventCard key={event.id} event={event} viewMode={viewMode} />
      ))}
    </div>
  )
}