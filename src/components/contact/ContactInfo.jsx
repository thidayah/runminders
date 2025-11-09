import { Icon } from '@iconify/react'
import Link from "next/link"

const contactMethods = [
  {
    icon: 'mdi:email',
    title: 'Email',
    value: 'info@runminders.id',
    description: 'Kami membalas dalam 1x24 jam'
  },
  {
    icon: 'mdi:phone',
    title: 'Telepon',
    value: '+62 812-3456-7890',
    description: 'Senin - Jumat, 09:00 - 18:00'
  },
  // {
  //   icon: 'mdi:map-marker',
  //   title: 'Kantor',
  //   value: 'Jakarta, Indonesia',
  //   description: 'Kunjungi dengan appointment'
  // },
  // {
  //   icon: 'mdi:clock',
  //   title: 'Support Hours',
  //   value: '24/7 Online Support',
  //   description: 'Untuk pertanyaan mendesak'
  // }
]

const socialMedia = [
  { icon: 'simple-icons:whatsapp', name: 'Whatsapp', url: 'https://wa.me/6281234567890' },
  { icon: 'simple-icons:instagram', name: 'Instagram', url: '#' },
  { icon: 'simple-icons:threads', name: 'Threads', url: '#' },
  // { icon: 'ic:baseline-tiktok', name: 'Tiktok', url: '#' },
  // { icon: 'mdi:twitter', name: 'Twitter', url: '#' },
  // { icon: 'mdi:facebook', name: 'Facebook', url: '#' },
  // { icon: 'mdi:linkedin', name: 'LinkedIn', url: '#' }
]

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Informasi Kontak</h3>
        
        <div className="space-y-4">
          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon icon={method.icon} width="20" height="20" className="text-primary" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{method.title}</div>
                <div className="text-primary font-medium">{method.value}</div>
                {/* <div className="text-gray-500 text-sm mt-1">{method.description}</div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Media Sosial</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {socialMedia.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Icon icon={social.icon} width="20" height="20" className="text-gray-600" />
              <span className="text-gray-700 font-medium">{social.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Help */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-2">Butuh Bantuan Cepat?</h4>
        <p className="text-gray-700 text-sm mb-4">
          Lihat halaman FAQ untuk pertanyaan yang sering diajukan
        </p>
        <Link 
          href={'faq'}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 cursor-pointer"
        >
          Buka FAQ
          <Icon icon="mdi:arrow-right" width="16" height="16" />
        </Link>
      </div>
    </div>
  )
}