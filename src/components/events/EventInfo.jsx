import { Icon } from '@iconify/react'

export default function EventInfo({ event }) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          {/* <Icon icon="mdi:information-outline" width="24" height="24" /> */}
          Tentang Event
        </h2>
        <p className="text-gray-600 leading-relaxed">{event?.description}</p>
      </div>

      {/* Highlights */}
      {event?.highlights.length && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:star-circle-outline" width="22" height="22" />
            Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {event?.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700">
                <Icon icon="mdi:check-circle" width="18" height="18" className="text-primary flex-shrink-0" />
                {highlight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule */}
      {event?.schedule.length && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:calendar-clock" width="22" height="22" />
            Jadwal Acara
          </h3>
          <div className="space-y-3">
            {event?.schedule.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 text-sm font-semibold text-primary flex items-center gap-1">
                  <Icon icon="mdi:clock-outline" width="16" height="16" />
                  {item.time}
                </div>
                <div className="flex-1 text-gray-700">{item.activity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements */}
      {event?.requirements.length && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Icon icon="mdi:clipboard-list-outline" width="22" height="22" />
            Persyaratan
          </h3>
          <div className="space-y-2">
            {event?.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700">
                <Icon icon="mdi:alert-circle" width="18" height="18" className="text-accent flex-shrink-0" />
                {requirement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizer */}
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Icon icon="mdi:office-building-outline" width="22" height="22" />
          Penyelenggara
        </h3>
        <div className="flex items-center gap-4">
          {/* <img 
            src={event.organizer.logo} 
            alt={event.organizer.name}
            className="w-16 h-16 rounded-full object-cover"
          /> */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800">{event?.organizer_name}</h4>
            {/* <p className="text-gray-600 text-sm flex items-center gap-1">
              <Icon icon="mdi:star" width="16" height="16" className="text-yellow-400" />
              {event.organizer.rating} • {event.organizer.events} Events
            </p> */}
            {/* <p className="text-gray-500 text-sm flex items-center gap-1">
              <Icon icon="mdi:email-outline" width="16" height="16" />
              {event.organizer.contact}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}