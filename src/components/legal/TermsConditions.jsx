import LegalLayout from '@/components/ui/LegalLayout'

export default function TermsConditions() {
  const termsSections = [
    { id: 'introduction', title: 'Penerimaan Ketentuan', icon: 'mdi:file-document-check' },
    { id: 'account-registration', title: 'Pendaftaran Akun', icon: 'mdi:account-plus' },
    { id: 'event-registration', title: 'Pendaftaran Event', icon: 'mdi:run-fast' },
    { id: 'user-conduct', title: 'Perilaku Pengguna', icon: 'mdi:account-convert' },
    { id: 'intellectual-property', title: 'Kekayaan Intelektual', icon: 'mdi:copyright' },
    { id: 'limitation-liability', title: 'Pembatasan Tanggung Jawab', icon: 'mdi:scale-balance' },
    { id: 'termination', title: 'Penghentian Layanan', icon: 'mdi:account-cancel' },
    { id: 'governing-law', title: 'Hukum yang Berlaku', icon: 'mdi:gavel' },
    { id: 'changes', title: 'Perubahan Ketentuan', icon: 'mdi:update' },
    { id: 'contact', title: 'Kontak', icon: 'mdi:phone' }
  ]
  return (
    <LegalLayout
      title="Syarat & Ketentuan"
      subtitle="Ketentuan penggunaan platform RUNminders. Silakan baca dengan seksama sebelum menggunakan layanan kami."
      lastUpdated="15 Desember 2024"
      sections={termsSections}
    >
      {/* Introduction */}
      <section id="introduction" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Penerimaan Ketentuan</h2>
        <p className="text-gray-700 mb-4">
          Dengan mengakses atau menggunakan platform RUNminders ("Platform"), Anda setuju
          untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan ketentuan
          apa pun, harap jangan gunakan Platform kami.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">
            <strong>Penting:</strong> Dengan membuat akun atau menggunakan Platform, Anda
            mengonfirmasi bahwa Anda telah membaca, memahami, dan menyetujui semua ketentuan
            yang tercantum di bawah ini.
          </p>
        </div>
      </section>

      {/* Account Registration */}
      <section id="account-registration" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Pendaftaran Akun</h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Kelayakan</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Anda berusia minimal 17 tahun</li>
          <li>Memiliki kapasitas hukum untuk membuat perjanjian yang mengikat</li>
          <li>Menyediakan informasi yang akurat dan lengkap</li>
          <li>Satu orang hanya boleh memiliki satu akun</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Kewajiban Akun</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Jaga kerahasiaan informasi login Anda</li>
          <li>Laporkan aktivitas mencurigakan segera</li>
          <li>Anda bertanggung jawab atas semua aktivitas di akun Anda</li>
          <li>Akun tidak dapat dialihkan atau dijual kepada pihak lain</li>
        </ul>
      </section>

      {/* Event Registration */}
      <section id="event-registration" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Pendaftaran Event</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-2">Persyaratan Kesehatan</h4>
            <p className="text-gray-700 text-sm">
              Anda bertanggung jawab untuk memastikan kondisi kesehatan yang memadai sebelum
              mendaftar event lari. RUNminders tidak bertanggung jawab atas cedera atau
              masalah kesehatan yang timbul selama partisipasi.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-2">Pembayaran dan Pembatalan</h4>
            <p className="text-gray-700 text-sm">
              Pembayaran bersifat final dan tidak dapat dikembalikan, kecuali event dibatalkan
              oleh penyelenggara. Kebijakan pembatalan spesifik dapat bervariasi per event.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-2">Transfer Pendaftaran</h4>
            <p className="text-gray-700 text-sm">
              Transfer pendaftaran kepada orang lain mungkin diperbolehkan dengan syarat tertentu
              dan biaya administrasi. Kebijakan transfer mengikuti ketentuan masing-masing event.
            </p>
          </div>
        </div>
      </section>

      {/* User Conduct */}
      <section id="user-conduct" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Perilaku Pengguna</h2>

        <div className="bg-gray-100 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Yang Dilarang:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span>Menyebarkan konten tidak senonoh atau ofensif</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span>Melakukan penipuan atau aktivitas ilegal</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span>Mengganggu pengguna lain</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span>Memanipulasi sistem atau eksploitasi bug</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span>Pelanggaran hak kekayaan intelektual</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">❌</span>
              <span>Spam atau iklan tidak diinginkan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section id="intellectual-property" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Kekayaan Intelektual</h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Hak RUNminders</h4>
            <p className="text-gray-700 text-sm">
              Seluruh konten, fitur, dan fungsi pada Platform, termasuk namun tidak terbatas
              pada teks, grafis, logo, dan kode, adalah milik RUNminders dan dilindungi oleh
              undang-undang hak cipta.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Konten Pengguna</h4>
            <p className="text-gray-700 text-sm">
              Anda mempertahankan kepemilikan atas konten yang Anda unggah, namun memberikan
              RUNminders lisensi global untuk menggunakan, menampilkan, dan mendistribusikan
              konten tersebut dalam rangka menyediakan layanan.
            </p>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section id="limitation-liability" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Pembatasan Tanggung Jawab</h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="font-semibold text-yellow-800 mb-3">Peringatan Penting:</h4>
          <p className="text-yellow-700 mb-4">
            RUNminders bertindak sebagai platform perantara antara peserta dan penyelenggara
            event. Kami tidak bertanggung jawab atas:
          </p>
          <ul className="list-disc list-inside text-yellow-700 space-y-2">
            <li>Cedera atau kecelakaan selama partisipasi event</li>
            <li>Kualitas atau pelaksanaan event oleh penyelenggara</li>
            <li>Kehilangan atau kerusakan properti pribadi</li>
            <li>Force majeure atau keadaan di luar kendali kami</li>
            <li>Keputusan medis atau darurat selama event</li>
          </ul>
        </div>
      </section>

      {/* Termination */}
      <section id="termination" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Penghentian Layanan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Oleh RUNminders</h4>
            <p className="text-gray-600 text-sm">
              Kami dapat menghentikan atau menangguhkan akses Anda jika melanggar ketentuan,
              dengan atau tanpa pemberitahuan sebelumnya.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Oleh Pengguna</h4>
            <p className="text-gray-600 text-sm">
              Anda dapat menghentikan penggunaan Platform kapan saja dengan menghapus akun
              melalui pengaturan atau menghubungi customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section id="governing-law" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Hukum yang Berlaku</h2>
        <p className="text-gray-700">
          Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
          Setiap sengketa yang timbul dari atau berkaitan dengan ketentuan ini akan diselesaikan
          di pengadilan yang berwenang di Jakarta, Indonesia.
        </p>
      </section>

      {/* Changes */}
      <section id="changes" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Perubahan Ketentuan</h2>
        <p className="text-gray-700 mb-4">
          Kami berhak untuk memodifikasi Syarat dan Ketentuan ini kapan saja. Perubahan akan
          efektif segera setelah diposting di Platform. Penggunaan berkelanjutan setelah
          perubahan berarti Anda menerima ketentuan yang diperbarui.
        </p>
      </section>

      {/* Contact */}
      <section id="contact">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Kontak</h2>
        <p className="text-gray-700 mb-4">
          Untuk pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi:
        </p>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-semibold text-gray-800">Email:</span>
            <a href="mailto:info@runminders.id" className="text-gray-700 hover:underline cursor-pointer">info@runminders.id</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">Website:</span>
            <span className="text-gray-700 hover:underline cursor-pointer">www.runminders.id/terms-conditions</span>
          </div>
          {/* <div className="flex items-center gap-3 mt-3">
            <span className="font-semibold text-gray-800">Alamat:</span>
            <span className="text-gray-700">Cimahi, Indonesia</span>
          </div> */}
        </div>
      </section>
    </LegalLayout>
  )
}