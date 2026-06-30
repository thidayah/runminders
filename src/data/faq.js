export const faqCategories = [
  { id: 'general', title: 'Umum', icon: 'mdi:information' },
  { id: 'account', title: 'Akun & Profil', icon: 'mdi:account' },
  { id: 'events', title: 'Event & Pendaftaran', icon: 'mdi:run' },
  { id: 'payment', title: 'Pembayaran', icon: 'mdi:credit-card' },
  { id: 'technical', title: 'Teknis', icon: 'mdi:cog' }
]

export const faqData = {
  general: [
    {
      question: 'Apa itu Runminders?',
      answer: 'Runminders adalah platform terdepan untuk menemukan, mendaftar, dan mengelola partisipasi dalam berbagai event lari di Indonesia. Kami menyediakan akses ke ratusan event lari dari berbagai penyelenggara terpercaya.'
    },
    {
      question: 'Apakah Runminders gratis?',
      answer: 'Ya, penggunaan platform Runminders sepenuhnya gratis. Biaya yang Anda bayar hanya untuk pendaftaran event yang Anda ikuti, sesuai dengan harga yang ditetapkan oleh penyelenggara event.'
    },
    {
      question: 'Bagaimana cara mulai menggunakan Runminders?',
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
      answer: 'Pembatalan hanya dapat dilakukan selama pendaftaran masih menunggu pembayaran. Setelah pembayaran berhasil dikonfirmasi, pendaftaran bersifat final dan tidak dapat dibatalkan melalui platform. Jika event dibatalkan oleh penyelenggara, pengembalian dana akan diproses sesuai ketentuan yang berlaku.'
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
      question: 'Apakah pembayaran di Runminders aman?',
      answer: 'Sangat aman. Kami menggunakan sistem pembayaran terenkripsi dan bekerja sama dengan payment gateway terpercaya. Data kartu kredit tidak disimpan di server kami.'
    },
    {
      question: 'Bagaimana cara mendapatkan invoice?',
      answer: 'Invoice dapat diunduh langsung dari dashboard Anda setelah pembayaran berhasil. Invoice juga akan dikirim ke email yang terdaftar.'
    }
  ],
  technical: [
    {
      question: 'Aplikasi mobile Runminders tersedia?',
      answer: 'Saat ini Runminders tersedia dalam versi web yang fully responsive. Aplikasi mobile sedang dalam pengembangan dan akan segera diluncurkan.'
    },
    {
      question: 'Website tidak bisa diakses, apa yang harus dilakukan?',
      answer: 'Coba clear cache browser, gunakan mode incognito, atau coba akses dari perangkat lain. Jika masalah berlanjut, hubungi tim technical support kami.'
    },
    {
      question: 'Bagaimana melaporkan bug atau masalah teknis?',
      answer: 'Anda dapat melaporkan masalah teknis melalui halaman Contact Us atau langsung email ke info@runminders.id. Sertakan screenshot dan detail perangkat yang digunakan.'
    }
  ]
}
