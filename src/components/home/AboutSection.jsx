import { Icon } from '@iconify/react'

const steps = [
  {
    icon: 'mdi:calendar-plus',
    label: 'Buat Event',
    desc: 'Setup event, kategori, dan harga pendaftaran dalam menit.',
  },
  {
    icon: 'mdi:account-arrow-right-outline',
    label: 'Peserta Daftar',
    desc: 'Form siap pakai, langsung bisa dibagikan ke peserta.',
  },
  {
    icon: 'mdi:credit-card-check-outline',
    label: 'Bayar Otomatis',
    desc: 'Transfer, QRIS, kartu — konfirmasi otomatis tanpa cek manual.',
  },
  {
    icon: 'mdi:monitor-dashboard',
    label: 'Pantau Dashboard',
    desc: 'Peserta dan status bayar real-time di satu tempat.',
  },
]

export default function AboutSection() {
  const features = [
    "Form registrasi otomatis, tanpa perlu bikin sistem sendiri dari nol",
    "Pembayaran terintegrasi via Payment Gateway, konfirmasi otomatis tanpa cek manual",
    "Dashboard untuk pantau peserta, status bayar, dan data registrasi real-time",
    "Peserta kamu juga bisa ditemukan oleh pelari yang cari event di kotanya",
  ]

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Alur 4 Langkah — 2×2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
                <span className="absolute top-3 right-3.5 text-xs font-bold text-gray-200">{i + 1}</span>
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon icon={step.icon} className="text-primary text-2xl" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 mb-1">{step.label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* === Kolom kiri lama (foto Unsplash) — dikomentari ===
          <div className="relative">
            <div className="rounded-tl-4xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1744868646521-2620c945a1fe?w=600&h=400"
                alt="Komunitas Pelari Runminders"
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          </div>
          === end kolom kiri lama === */}

          {/* Content */}
          <div>
            {/* <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <span>🚀</span>
              Platform Baru, Semangat Baru!
            </div> */}

            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
              Ribet bikin form pendaftaran manual?
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Setiap kali ada event lari, organizer biasanya harus bikin sistem pendaftaran sendiri
              dari nol, pantau pembayaran manual lewat transfer, terus konfirmasi satu-satu by chat.
              Runminders ambil alih semua itu — biar kamu fokus ke eventnya, bukan adminnya.
            </p>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-700 group">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
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