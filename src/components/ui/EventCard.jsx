import Link from "next/link"
import { Icon } from "@iconify/react"
import Button from './Button'

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Event Image - Square Ratio 1:1 dengan Real Image */}
      {/* <div className="relative aspect-square overflow-hidden"> */}
      <Link href={'/events/1'}>
        <div className="relative aspect-video overflow-hidden">
          {/* Background Image */}
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${event.image})` }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Badge/Status */}
          <div className="absolute top-3 left-3">
            <span className={`
            px-2 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm
            ${event.badge === 'Coming Soon' ? 'bg-blue-500/90' :
                event.badge === 'Trending' ? 'bg-green-500/90' :
                  event.badge === 'New' ? 'bg-orange-500/90' :
                    event.badge === 'Limited' ? 'bg-red-500/90' :
                      event.badge === 'Family' ? 'bg-yellow-500/90' :
                        event.badge === 'Exclusive' ? 'bg-purple-500/90' :
                          event.badge === 'Adventure' ? 'bg-teal-500/90' :
                            event.badge === 'Popular' ? 'bg-pink-500/90' :
                              'bg-primary/90'
              }
          `}>
              {event.badge}
            </span>
          </div>


          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer">
            <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-primary px-4 py-2 rounded-full font-semibold text-sm shadow-lg cursor-pointer">
              Lihat Detail
            </button>
          </div>
        </div>
      </Link>

      {/* Event Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-neutral-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200 h-14">
          {event.title}
        </h3>

        <div className="space-y-2 text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:map-marker" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:calendar" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:account-group" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm">{event.participants}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:clock-outline" width="16" height="16" className="text-primary flex-shrink-0" />
            <span className="text-sm">
              {event.type === 'marathon' ? '42K • Expert' :
                event.type === 'trail' ? '15-25K • Adventure' :
                  event.type === 'virtual' ? 'Flexible • All Levels' :
                    event.type === 'charity' ? '5-10K • Community' :
                      '5K • Family Friendly'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">Mulai dari</span>
            <span className="text-2xl font-bold text-primary block">
              Rp {event.price.toLocaleString('id-ID')}
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="group-hover:scale-105 transition-transform duration-200"
          >
            Daftar
          </Button>
        </div>
      </div>
    </div>
  )
}