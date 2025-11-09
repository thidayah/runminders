import LegalLayout from '@/components/ui/LegalLayout'
import { Icon } from '@iconify/react'

export default function PrivacyPolicy() {
  const privacySections = [
    { id: 'introduction', title: 'Pendahuluan', icon: 'mdi:book-open' },
    { id: 'data-collection', title: 'Pengumpulan Data', icon: 'mdi:database' },
    { id: 'data-usage', title: 'Penggunaan Data', icon: 'mdi:rocket' },
    { id: 'data-sharing', title: 'Berbagi Data', icon: 'mdi:handshake' },
    { id: 'user-rights', title: 'Hak Pengguna', icon: 'mdi:shield-account' },
    { id: 'cookies', title: 'Cookies', icon: 'mdi:cookie' },
    { id: 'security', title: 'Keamanan', icon: 'mdi:lock' },
    { id: 'changes', title: 'Perubahan', icon: 'mdi:update' },
    { id: 'contact', title: 'Kontak', icon: 'mdi:phone' }
  ]

  return (
    <LegalLayout
      title="Kebijakan Privasi"
      subtitle="Kami berkomitmen melindungi privasi dan data pribadi Anda. Ketahui bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda."
      lastUpdated="15 Desember 2024"
      sections={privacySections}
    >
      {/* Introduction */}
      <section id="introduction" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Pendahuluan</h2>
        <p className="text-gray-700 mb-4">
          RUNminders ("kami", "kita", "platform") menghargai privasi Anda dan berkomitmen
          untuk melindungi data pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini
          menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi
          informasi Anda ketika Anda menggunakan platform RUNminders.
        </p>
        <p className="text-gray-700">
          Dengan mengakses atau menggunakan layanan kami, Anda menyetujui pengumpulan dan
          penggunaan informasi sesuai dengan kebijakan ini.
        </p>
      </section>

      {/* Data Collection */}
      <section id="data-collection" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Informasi yang Kami Kumpulkan</h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Informasi yang Anda Berikan</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Data profil (nama, email, nomor telepon, tanggal lahir)</li>
          <li>Informasi pendaftaran event (data medis, kondisi kesehatan)</li>
          <li>Data pembayaran dan transaksi</li>
          <li>Konten yang Anda bagikan (foto, review, komentar)</li>
          <li>Informasi komunikasi dengan customer service</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Informasi yang Dikumpulkan Otomatis</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Data penggunaan platform (log aktivitas, interaksi)</li>
          <li>Informasi perangkat (IP address, tipe browser, sistem operasi)</li>
          <li>Data lokasi (jika diizinkan)</li>
          <li>Cookies dan teknologi pelacakan serupa</li>
        </ul>
      </section>

      {/* Data Usage */}
      <section id="data-usage" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Cara Kami Menggunakan Informasi</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-blue-800 mb-3">Tujuan Penggunaan Data:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Menyediakan dan memelihara layanan</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Memproses pendaftaran event</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Mengirim notifikasi penting</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Meningkatkan pengalaman pengguna</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Analisis dan pengembangan fitur</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Pencegahan penipuan dan keamanan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section id="data-sharing" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Berbagi Informasi</h2>
        <p className="text-gray-700 mb-4">
          Kami tidak menjual data pribadi Anda kepada pihak ketiga. Informasi dapat dibagikan
          dalam kondisi berikut:
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Penyelenggara Event</h4>
            <p className="text-gray-600 text-sm">
              Informasi pendaftaran yang diperlukan untuk keperluan event (nama, nomor telepon,
              data medis darurat) dibagikan kepada penyelenggara event yang Anda ikuti.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Penyedia Layanan</h4>
            <p className="text-gray-600 text-sm">
              Vendor tepercaya yang membantu operasional platform (pembayaran, hosting, analytics)
              dengan kewajiban kerahasiaan yang ketat.
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Kepatuhan Hukum</h4>
            <p className="text-gray-600 text-sm">
              Jika diwajibkan oleh hukum, peraturan pengadilan, atau proses hukum yang sah.
            </p>
          </div>
        </div>
      </section>

      {/* User Rights */}
      <section id="user-rights" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Hak-Hak Anda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Akses dan Koreksi</h4>
            <p className="text-green-700 text-sm">
              Anda dapat mengakses dan memperbarui informasi profil kapan saja melalui pengaturan akun.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Penghapusan Data</h4>
            <p className="text-green-700 text-sm">
              Meminta penghapusan data pribadi, dengan pengecualian data yang wajib disimpan secara hukum.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Pencabutan Izin</h4>
            <p className="text-green-700 text-sm">
              Anda dapat mencabut persetujuan pemrosesan data kapan saja melalui pengaturan privasi.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Portabilitas Data</h4>
            <p className="text-green-700 text-sm">
              Meminta salinan data pribadi Anda dalam format yang dapat dibaca mesin.
            </p>
          </div>
        </div>
      </section>

      {/* Cookies */}
      <section id="cookies" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies dan Teknologi Pelacakan</h2>
        <p className="text-gray-700 mb-4">
          Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda,
          menganalisis traffic, dan menampilkan iklan yang relevan.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="font-semibold text-yellow-800 mb-3">Jenis Cookies yang Kami Gunakan:</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-yellow-700">Cookies Esensial</h5>
              <p className="text-yellow-600 text-sm">Diperlukan untuk fungsi dasar platform</p>
            </div>
            <div>
              <h5 className="font-medium text-yellow-700">Cookies Fungsionalitas</h5>
              <p className="text-yellow-600 text-sm">Mengingat preferensi dan pengaturan Anda</p>
            </div>
            <div>
              <h5 className="font-medium text-yellow-700">Cookies Analytics</h5>
              <p className="text-yellow-600 text-sm">Memahami bagaimana Anda menggunakan platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Keamanan Data</h2>
        <p className="text-gray-700 mb-4">
          Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk
          melindungi data pribadi Anda dari akses, pengungkapan, alterasi, atau penghancuran
          yang tidak sah.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <Icon icon="mdi:lock" width="32" height="32" className="mb-2" />
            <div className="font-semibold text-gray-800">Enkripsi Data</div>
            <div className="text-gray-600 text-sm mt-1">Data dienkripsi selama transmisi dan penyimpanan</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <Icon icon="mdi:shield-account" width="32" height="32" className="mb-2" />
            <div className="font-semibold text-gray-800">Akses Terkontrol</div>
            <div className="text-gray-600 text-sm mt-1">Hanya personel berwenang yang dapat mengakses data</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
            <Icon icon="mdi:chart-box" width="32" height="32" className="mb-2" />
            <div className="font-semibold text-gray-800">Monitor Berkelanjutan</div>
            <div className="text-gray-600 text-sm mt-1">Sistem kami dipantau 24/7 untuk deteksi ancaman</div>
          </div>
        </div>
      </section>

      {/* Changes */}
      <section id="changes" className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Perubahan Kebijakan</h2>
        <p className="text-gray-700">
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan
          memberitahukan Anda tentang perubahan material melalui email atau pemberitahuan
          di platform. Tanggal efektif terbari akan ditampilkan di bagian atas halaman ini.
        </p>
      </section>

      {/* Contact */}
      <section id="contact">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Hubungi Kami</h2>
        <p className="text-gray-700 mb-4">
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau bagaimana kami
          menangani data pribadi Anda, silakan hubungi:
        </p>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-semibold text-gray-800">Email:</span>
            <a href="mailto:info@runminders.id" className="text-gray-700 hover:underline cursor-pointer">info@runminders.id</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">Website:</span>
            <span className="text-gray-700 hover:underline cursor-pointer">www.runminders.id/privacy-policy</span>
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