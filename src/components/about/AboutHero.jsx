import { heroContent } from '@/data/about'

export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {heroContent.heading}
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {heroContent.description}
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