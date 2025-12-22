import { Icon } from '@iconify/react'

export default function EventHeader({ event }) {
  return (
    <div className="relative bg-gradient-to-br bg-primary via-primary to-white">
      {/* Background Image */}
      <div
        className="h-96 bg-cover bg-center"
      // style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl text-white">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event?.categories1.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
              <span className="px-3 py-1 bg-accent/80 backdrop-blur-sm rounded-full text-sm font-medium">
                {event?.difficulty}
              </span>
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
                <span>{event?.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:clock-outline" width="20" height="20" />
                <span>{event?.time}</span>
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