'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Layout from "@/components/layout/Layout"
import Button from "@/components/ui/Button"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  const handleRedirectNow = () => {
    router.push('/dashboard')
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="max-w-xl w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:clock-outline" className="w-16 h-16 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Pembayaran Tertunda
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Terima kasih telah mendaftar. Mohon selesaikan pembayaran dalam waktu yang telah ditentukan.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Nomor Registrasi</p>
              <p className="font-mono font-bold text-gray-800 text-lg">{orderId}</p>
            </div>
          )}

          {/* Possible Reasons */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-left">Langkah Selanjutnya</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex text-left gap-2">
                <Icon icon="mdi:information-slab-circle-outline" className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Selesaikan pembayaran menggunakan metode yang telah anda pilih sebelumnya.</span>
              </li>
              <li className="flex text-left gap-2">
                <Icon icon="mdi:information-slab-circle-outline" className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Pembayaran akan diverifikasi secara otomatis oleh sistem</span>
              </li>
              <li className="flex text-left gap-2">
                <Icon icon="mdi:information-slab-circle-outline" className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Email konfirmasi akan dikirim setelah pembayaran dikonfirmasi.</span>
              </li>
            </ul>
          </div>

          {/* Quick Tips */}
          <div className=" bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-left mb-4">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information" className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">Tips</p>
                <p className="text-sm text-yellow-700">
                  • Silakan periksa kotak masuk email Anda untuk menyelesaikan proses pembayaran sebelum kedaluwarsa.
                </p>
                <p className="text-sm text-yellow-700">
                  • Selesaikan pembayaran dalam waktu yang di tentukan untuk mengamankan pendaftaran Anda.
                </p>
                <p className="text-sm text-yellow-700">
                  • Gunakan jumlah yang tepat seperti yang tertera saat pembayaran.
                </p>
                <p className="text-sm text-yellow-700">
                  • Simpan struk transaksi Anda sebagai referensi.
                </p>
                <p className="text-sm text-yellow-700">
                  • Hubungi bank Anda jika terjadi masalah transfer.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-2 justify-center">
              <Button
                onClick={handleRedirectNow}
                variant="primary"
                size="md"
              >
                <Icon icon="mdi:view-dashboard" className="mr-2" />
                Ke Dashboard
              </Button>

              <Link href="/contact" className="block">
                <Button variant="outline" size="md" >
                  <Icon icon="mdi:chat-question" className="mr-2" />
                  Butuh Bantuan?
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import Layout from "@/components/layout/Layout"
// import Button from "@/components/ui/Button"
// import Link from "next/link"
// import { Icon } from "@iconify/react"

// export default function PaymentPendingPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const orderId = searchParams.get('order_id')
//   const transactionStatus = searchParams.get('transaction_status')

//   const [checkingStatus, setCheckingStatus] = useState(false)

//   const checkPaymentStatus = async () => {
//     if (!orderId) return
    
//     setCheckingStatus(true)
//     try {
//       // Polling ke API untuk cek status
//       const response = await fetch(`/api/payments/status/${orderId}`)
//       const result = await response.json()
      
//       if (result.success) {
//         const status = result.data.transaction_status
        
//         if (status === 'settlement') {
//           // Redirect ke success page
//           router.push(`/registration/success?order_id=${orderId}`)
//         } else if (status === 'deny' || status === 'cancel' || status === 'expire') {
//           // Redirect ke failed page
//           router.push(`/registration/failed?order_id=${orderId}`)
//         }
//       }
//     } catch (error) {
//       console.error('Error checking payment status:', error)
//     } finally {
//       setCheckingStatus(false)
//     }
//   }

//   useEffect(() => {
//     // Auto check status setiap 10 detik
//     const interval = setInterval(checkPaymentStatus, 10000)
    
//     // Check immediately
//     checkPaymentStatus()
    
//     return () => clearInterval(interval)
//   }, [orderId])

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
//         <div className="container mx-auto px-4">
//           <div className="max-w-2xl mx-auto">
//             {/* Pending Card */}
//             <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 text-center text-white">
//                 <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
//                   <Icon icon="mdi:clock-outline" className="w-12 h-12" />
//                 </div>
//                 <h1 className="text-3xl font-bold mb-2">Pembayaran Diproses</h1>
//                 <p className="text-blue-100 opacity-90">
//                   Transaksi Anda sedang dalam proses verifikasi
//                 </p>
//               </div>

//               {/* Content */}
//               <div className="p-8">
//                 {/* Status Information */}
//                 <div className="mb-8">
//                   <div className="text-center mb-6">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                       <Icon icon="mdi:sync" className="w-8 h-8 text-blue-600 animate-spin" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-800 mb-2">Menunggu Konfirmasi</h2>
//                     <p className="text-gray-600">
//                       Pembayaran Anda sedang diproses oleh sistem. Proses ini biasanya memakan waktu beberapa menit.
//                     </p>
//                   </div>

//                   {/* Order Details */}
//                   {orderId && (
//                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="text-sm text-blue-600 font-medium mb-1">No. Transaksi</p>
//                           <p className="text-gray-800 font-mono">{orderId}</p>
//                         </div>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={checkPaymentStatus}
//                           loading={checkingStatus}
//                         >
//                           {checkingStatus ? 'Memeriksa...' : 'Cek Status'}
//                         </Button>
//                       </div>
//                     </div>
//                   )}

//                   {/* What to expect */}
//                   <div className="space-y-4">
//                     <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
//                       <Icon icon="mdi:clock-alert" className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-medium text-gray-800">Durasi Proses</p>
//                         <p className="text-sm text-gray-600 mt-1">
//                           Proses verifikasi dapat memakan waktu 5-30 menit tergantung metode pembayaran
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
//                       <Icon icon="mdi:email-fast" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-medium text-gray-800">Notifikasi Email</p>
//                         <p className="text-sm text-gray-600 mt-1">
//                           Anda akan menerima email konfirmasi begitu pembayaran berhasil diverifikasi
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Common Payment Methods Info */}
//                 <div className="mb-8">
//                   <h3 className="font-semibold text-gray-800 mb-4">Info Metode Pembayaran</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Icon icon="mdi:bank" className="w-5 h-5 text-blue-500" />
//                         <span className="font-medium text-gray-800">Transfer Bank</span>
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         Konfirmasi otomatis dalam 1-2 menit setelah transfer
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Icon icon="mdi:cellphone" className="w-5 h-5 text-green-500" />
//                         <span className="font-medium text-gray-800">E-Wallet</span>
//                       </div>
//                       <p className="text-sm text-gray-600">
//                         Konfirmasi instan setelah pembayaran berhasil
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <Button 
//                       variant="outline" 
//                       size="lg" 
//                       fullWidth
//                       onClick={checkPaymentStatus}
//                       loading={checkingStatus}
//                     >
//                       <Icon icon="mdi:refresh" className="mr-2" />
//                       Periksa Status
//                     </Button>
                    
//                     <Link href="/contact" className="w-full">
//                       <Button variant="outline" size="lg" fullWidth>
//                         <Icon icon="mdi:chat-question" className="mr-2" />
//                         Butuh Bantuan?
//                       </Button>
//                     </Link>
//                   </div>
                  
//                   <Link href="/dashboard" className="block">
//                     <Button variant="primary" size="lg" fullWidth>
//                       <Icon icon="mdi:home" className="mr-2" />
//                       Kembali ke Dashboard
//                     </Button>
//                   </Link>
//                 </div>
//               </div>

//               {/* Auto-check notice */}
//               <div className="border-t border-gray-200 p-4 bg-gray-50">
//                 <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//                   <Icon icon="mdi:information" className="w-4 h-4" />
//                   <span>Sistem akan secara otomatis memeriksa status setiap 10 detik</span>
//                 </div>
//               </div>
//             </div>

//             {/* Important Note */}
//             <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
//               <div className="flex items-start gap-3">
//                 <Icon icon="mdi:alert-circle" className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium text-amber-800 mb-1">Penting!</p>
//                   <p className="text-sm text-amber-700">
//                     Jangan tutup halaman ini selama proses verifikasi berlangsung. 
//                     Jika Anda keluar, Anda dapat kembali ke halaman ini melalui email konfirmasi.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// }