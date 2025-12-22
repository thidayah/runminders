'use client'

export default function EventMap({ event }) {
  // Sample coordinates - GBK Jakarta
  const coordinates = event.coordinates || { lat: -6.2186, lng: 106.8028 }

  const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15`
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=600x400&markers=color:red%7C${coordinates.lat},${coordinates.lng}&key=YOUR_API_KEY`

  return (
    <div className="space-y-8">
      {/* Location Details */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi Event</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{event.location}</h3>
              <p className="text-gray-600">{event.address}</p>          
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="h-[250px] bg-grey-300 relative flex items-center justify-center">
          <iframe
            width="100%"
            height="250px"
            frameBorder="0"
            style={{ border: 0}}
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Gelora%20Bung%20Karno%20Stadium%2C%20Jalan%20Pintu%20Satu%20Senayan%2C%20Gelora%2C%20Central%20Jakarta%20City%2C%20Jakarta%2C%20Indonesia&maptype=roadmap"
            allowFullScreen
          >
          </iframe>
        </div>

        <div className="p-4 bg-gray-50 border-t justify-center flex">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-bold hover:underline"
          >
            Buka di Google Maps
          </a>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Informasi Penting</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Datang 1-2 jam sebelum start untuk registrasi</li>
          <li>• Gunakan transportasi umum untuk menghindari kemacetan</li>
          <li>• Parkir terbatas, datang lebih awal jika membawa kendaraan</li>
          <li>• Titik kumpul peserta di Gate Start</li>
        </ul>
      </div>
    </div>
  )
}