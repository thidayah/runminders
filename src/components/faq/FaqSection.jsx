'use client'

import { useState } from 'react'
import FaqAccordion from './FaqAccordion'

const faqCategories = [
  {
    id: 'general',
    title: 'Umum',
    icon: 'mdi:information'
  },
  {
    id: 'account',
    title: 'Akun & Profil',
    icon: 'mdi:account'
  },
  {
    id: 'events',
    title: 'Event & Pendaftaran',
    icon: 'mdi:run'
  },
  {
    id: 'payment',
    title: 'Pembayaran',
    icon: 'mdi:credit-card'
  },
  {
    id: 'technical',
    title: 'Teknis',
    icon: 'mdi:cog'
  }
]

const faqData = {
  general: [
    {
      question: 'Apa itu RUNminders?',
      answer: 'RUNminders adalah platform terdepan untuk menemukan, mendaftar, dan mengelola partisipasi dalam berbagai event lari di Indonesia. Kami menyediakan akses ke ratusan event lari dari berbagai penyelenggara terpercaya.'
    },
    {
      question: 'Apakah RUNminders gratis?',
      answer: 'Ya, penggunaan platform RUNminders sepenuhnya gratis. Biaya yang Anda bayar hanya untuk pendaftaran event yang Anda ikuti, sesuai dengan harga yang ditetapkan oleh penyelenggara event.'
    },
    {
      question: 'Bagaimana cara mulai menggunakan RUNminders?',
      answer: 'Cukup buat akun dengan email Anda, lengkapi profil, dan mulai jelajahi berbagai event lari yang tersedia. Anda bisa mencari event berdasarkan lokasi, jarak, tingkat kesulitan, atau tanggal.'
    }
  ],
  account: [
    {
      question: 'Bagaimana cara mengubah data profil?',
      answer: 'Anda dapat mengubah data profil kapan saja melalui menu "Profil Saya" di dashboard. Data yang dapat diubah termasuk nama, foto profil, nomor telepon, dan informasi kesehatan dasar.'
    },
    {
      question: 'Apakah saya bisa menghapus akun?',
      answer: 'Ya, Anda dapat menghapus akun kapan saja melalui pengaturan. Namun, harap diperhatikan bahwa penghapusan akun akan menghapus semua data pribadi dan riwayat event Anda.'
    },
    {
      question: 'Lupa password, bagaimana resetnya?',
      answer: 'Klik "Lupa Password" di halaman login, masukkan email Anda, dan kami akan mengirimkan link reset password. Pastikan email yang digunakan masih aktif.'
    }
  ],
  events: [
    {
      question: 'Bagaimana cara mendaftar event?',
      answer: 'Pilih event yang ingin Anda ikuti, klik "Daftar", pilih kategori lari, isi data yang diperlukan, dan lanjutkan ke pembayaran. Setelah pembayaran berhasil, Anda terdaftar secara otomatis.'
    },
    {
      question: 'Apakah bisa membatalkan pendaftaran event?',
      answer: 'Kebijakan pembatalan berbeda untuk setiap event. Secara umum, pembayaran bersifat final. Namun, beberapa event mengizinkan transfer pendaftaran dengan biaya administrasi.'
    },
    {
      question: 'Bagaimana jika event dibatalkan penyelenggara?',
      answer: 'Jika event dibatalkan oleh penyelenggara, Anda akan mendapatkan pengembalian dana penuh sesuai metode pembayaran yang digunakan dalam 7-14 hari kerja.'
    }
  ],
  payment: [
    {
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Kami menerima berbagai metode pembayaran termasuk transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (Gopay, OVO, Dana), dan kartu kredit/debit.'
    },
    {
      question: 'Apakah pembayaran di RUNminders aman?',
      answer: 'Sangat aman. Kami menggunakan sistem pembayaran terenkripsi dan bekerja sama dengan payment gateway terpercaya. Data kartu kredit tidak disimpan di server kami.'
    },
    {
      question: 'Bagaimana cara mendapatkan invoice?',
      answer: 'Invoice dapat diunduh langsung dari dashboard Anda setelah pembayaran berhasil. Invoice juga akan dikirim ke email yang terdaftar.'
    }
  ],
  technical: [
    {
      question: 'Aplikasi mobile RUNminders tersedia?',
      answer: 'Saat ini RUNminders tersedia dalam versi web yang fully responsive. Aplikasi mobile sedang dalam pengembangan dan akan segera diluncurkan.'
    },
    {
      question: 'Website tidak bisa diakses, apa yang harus dilakukan?',
      answer: 'Coba clear cache browser, gunakan mode incognito, atau coba akses dari perangkat lain. Jika masalah berlanjut, hubungi tim technical support kami.'
    },
    {
      question: 'Bagaimana melaporkan bug atau masalah teknis?',
      answer: 'Anda dapat melaporkan masalah teknis melalui halaman Contact Us atau langsung email ke support@runminders.id. Sertakan screenshot dan detail perangkat yang digunakan.'
    }
  ]
}

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (category, index) => {
    setOpenItems(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeCategory === category.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="p-8">
        <div className="space-y-4">
          {faqData[activeCategory]?.map((faq, index) => (
            <FaqAccordion
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems[`${activeCategory}-${index}`]}
              onToggle={() => toggleItem(activeCategory, index)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Masih ada pertanyaan?
          </h3>
          <p className="text-gray-600 mb-4">
            Tim support kami siap membantu menjawab pertanyaan Anda
          </p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  )
}