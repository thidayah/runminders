import EventCard from '@/components/ui/EventCard'

export default function EventGrid({ events, loading, viewMode }) {  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
            <div className="space-y-3">
              <div className="bg-gray-200 rounded h-4 w-3/4"></div>
              <div className="bg-gray-200 rounded h-3 w-1/2"></div>
              <div className="bg-gray-200 rounded h-3 w-2/3"></div>
              <div className="flex justify-between mt-4">
                <div className="bg-gray-200 rounded h-6 w-20"></div>
                <div className="bg-gray-200 rounded h-8 w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
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