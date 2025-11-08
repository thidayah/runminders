// import { Icon } from '@iconify/react'

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 mb-6">
            <Icon icon="mdi:information" width="20" height="20" className="text-primary" />
            <span className="text-sm font-medium text-gray-700">Tentang RUNminders</span>
          </div> */}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lebih dari Sekadar Platform Lari
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            RUNminders hadir untuk menyatukan komunitas pelari Indonesia dalam satu platform 
            yang modern, terpercaya, dan penuh semangat. Dari pemula hingga atlet profesional, 
            kami hadir untuk setiap langkah perjalanan lari Anda.
          </p>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Pelari Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Event</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-gray-600">Kota</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Partner</div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}