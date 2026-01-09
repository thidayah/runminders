'use client'

export default function EventMap({ event }) {
  // Sample coordinates - GBK Jakarta
  // const coordinates = event.coordinates || { lat: -6.2186, lng: 106.8028 }
  // const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15`
  // const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=600x400&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=YOUR_API_KEY`
  return (
    <div className="space-y-8">
      {/* Location Details */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi Event</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{event?.location}</h3>
              <p className="text-gray-600">{event?.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      {event?.location_link && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="h-[300px] bg-grey-300 relative flex items-center justify-center">
            <iframe
              // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3352298882783!2d106.80551577579897!3d-6.2194493937685875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f129f3a1c67b%3A0x887cb0edfe9ad98e!2sParkir%20Timur%20Senayan!5e0!3m2!1sen!2sid!4v1767152448661!5m2!1sen!2sid"
              src={event?.location_link}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>

          {/* <div className="p-4 bg-gray-50 justify-center flex">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline"
          >
            Buka di Google Maps
          </a>
        </div> */}
        </div>
      )}

      {/* Important Notes */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Informasi Penting</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Datang 1-2 jam sebelum start</li>
          <li>• Gunakan transportasi umum untuk menghindari kemacetan</li>
          <li>• Parkir terbatas, datang lebih awal jika membawa kendaraan</li>
          <li>• Titik kumpul peserta di Gate Start</li>
        </ul>
      </div> */}
    </div>
  )
}