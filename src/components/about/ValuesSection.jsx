import { Icon } from '@iconify/react'

const values = [
  {
    icon: 'mdi:heart',
    title: 'Komunitas',
    description: 'Kami percaya kekuatan berlari ada dalam kebersamaan dan dukungan komunitas.'
  },
  {
    icon: 'mdi:rocket',
    title: 'Inovasi',
    description: 'Terus berinovasi memberikan pengalaman terbaik bagi pelari Indonesia.'
  },
  {
    icon: 'mdi:shield-check',
    title: 'Kepercayaan',
    description: 'Keamanan data dan transaksi menjadi prioritas utama kami.'
  },
  {
    icon: 'mdi:run',
    title: 'Semangat',
    description: 'Mendorong setiap pelari untuk mencapai tujuan dan impian mereka.'
  }
]

export default function ValuesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nilai-Nilai Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fondasi yang membangun RUNminders menjadi platform terpercaya untuk komunitas pelari
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon icon={value.icon} width="32" height="32" className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}