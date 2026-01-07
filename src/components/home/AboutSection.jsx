export default function AboutSection() {
  const features = [
    "Platform yang khusus fokus pada event lari di Indonesia",
    // "Kurasi event berkualitas dari penyelenggara terpercaya", 
    "Proses pendaftaran yang simpel hanya dalam 3 langkah",
    "Komunitas growing dengan 10.000+ pelari aktif",
    // "Support penuh untuk pelari pemula dengan training guide",
    // "Update event real-time dan notifikasi personalized",
    "Dari pemula hingga pelari profesional", 
    "Sistem pendaftaran yang aman dan cepat",
    "Fleksibel dengan berbagai metode pembayaran",
    "Virtual dan offline races"

    // "100+ Event lari setiap bulan",
    // "Komunitas pelari terbesar di Indonesia",
  ]

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image dengan gambar asli */}
          <div className="relative">
            <div className="rounded-tl-4xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1744868646521-2620c945a1fe?w=600&h=400"
                alt="Komunitas Pelari Runminders"
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
            
            {/* Floating Stats Cards */}
            {/* <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">10K+</div>
                <div className="text-sm text-gray-600">Pelari Aktif</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-primary text-white rounded-2xl p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">50+</div>
                <div className="text-sm opacity-90">Event Partner</div>
              </div>
            </div> */}
          </div>

          {/* Content */}
          <div>
            {/* <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span>🚀</span>
              Platform Baru, Semangat Baru!
            </div> */}

            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
              Revolusi Pengalaman Lari Anda
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Runminders hadir sebagai solusi lengkap untuk para pelari Indonesia. 
              Dari menemukan event yang tepat, pendaftaran yang mudah, hingga menjadi bagian 
              dari komunitas yang saling mendukung. Kami membangun ekosistem lari yang 
              <span className="text-primary font-semibold"> inklusif dan modern</span>.
            </p>
            
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-700 group">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="group-hover:text-primary transition-colors duration-200">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            
          </div>
        </div>

        
      </div>
    </section>
  )
}