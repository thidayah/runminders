import { formatDate, formatTime } from "@/lib/formatters-utils"
import { Icon } from '@iconify/react'

export default function EventHeader({ event }) {
  // Ambil kategori dari event.categories (array dari API)
  const getCategories = () => {
    if (!event?.categories || !Array.isArray(event.categories)) {
      return []
    }

    // Ambil nama kategori dari setiap item categories
    return event.categories.map(cat => cat.name || cat.distance)
  }

  // Cek apakah ada early bird
  const hasEarlyBird = event?.has_early_bird &&
    event.early_bird_end_date &&
    new Date(event.early_bird_end_date) > new Date()

  return (
    <div className="relative bg-gradient-to-br bg-primary via-primary to-white">
      {/* Background Image */}
      <div
        className="h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${event?.image_url || 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=600&fit=crop'})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl text-white">
            {/* Categories & Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Event categories */}
              {getCategories().map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                >
                  {category}
                </span>
              ))}
              {/* Early bird badge */}
              {hasEarlyBird && (
                <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  Early Bird
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              {event?.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
              {event?.subtitle}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar-outline" width="20" height="20" />
                <span>{formatDate(event?.event_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:clock-outline" width="20" height="20" />
                <span>{formatTime(event?.event_time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:map-marker-outline" width="20" height="20" />
                <span>{event?.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}